/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  AppScreen,
  MonsterItem,
  RoomType,
  GradeType,
  EquipmentId,
  AvatarType,
  SessionRecord,
} from './types';
import { testFirestoreConnection, auth, syncScoreToLeaderboard } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { calculateEdgeDensity, generateFallbackMonsters } from './utils/image';
import { TopHeader, BottomNav } from './components/Navbar';
import { CameraCapture } from './components/CameraCapture';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { GemVaultModal } from './components/GemVaultModal';
import { WelcomeView } from './views/WelcomeView';
import { HomeView } from './views/HomeView';
import { ScanView } from './views/ScanView';
import { QuestView } from './views/QuestView';
import { VerifyView } from './views/VerifyView';
import { ResultPassView } from './views/ResultPassView';
import { ResultFailView } from './views/ResultFailView';
import { HistoryView } from './views/HistoryView';
import { LeagueView } from './views/LeagueView';
import { LockerView } from './views/LockerView';
import { ProfileView } from './views/ProfileView';
import { DuelView } from './views/DuelView';

const STORAGE_KEY = 'pq.profile.v3';

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function getMondayKey(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().split('T')[0];
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'guest-' + Math.random().toString(36).substring(2, 9),
  displayName: 'Operator',
  avatar: 'fox',
  equippedItem: 'none',
  ownedEquipment: ['none'],
  level: 1,
  xp: 120,
  coins: 80,
  gems: 6,
  streak: 1,
  lastPlayedDay: getTodayKey(),
  checkedInDays: [getTodayKey()],
  boosters: {
    xpBoostSessionsLeft: 0,
    hasStreakShield: false,
    hasRadarActive: false,
  },
  weekXp: 120,
  weekStart: getMondayKey(),
  totalMessCleared: 34,
  roomsCompleted: 1,
  monstersBeaten: 4,
  dailyQuestCount: 1,
  dailyQuestDay: getTodayKey(),
  bestTimeSeconds: 420,
  theme: 'dark',
  soundEnabled: true,
  hapticsEnabled: true,
  hasCompletedOnboarding: false,
  history: [
    {
      id: 'demo-session-init',
      date: new Date(Date.now() - 86400000).toISOString(),
      roomType: 'bedroom',
      messBefore: 68,
      messAfter: 34,
      improvement: 34,
      grade: 'A',
      durationSeconds: 420,
      xpEarned: 120,
      coinsEarned: 60,
      gemsEarned: 2,
      commentary: 'Clothing pile eliminated and bedside surface restored. Acceptable execution.',
      isFallback: false,
      monstersCount: 4,
    },
  ],
  apiTelemetry: {
    calls: 2,
    fallbackCount: 0,
  },
};

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          boosters: {
            ...DEFAULT_PROFILE.boosters,
            ...(parsed.boosters || {}),
          },
          checkedInDays: parsed.checkedInDays || [getTodayKey()],
        };
      }
    } catch (e) {
      console.warn('Storage unavailable, using defaults');
    }
    return DEFAULT_PROFILE;
  });

  const [screen, setScreen] = useState<AppScreen>(() => {
    return profile.hasCompletedOnboarding ? 'home' : 'welcome';
  });

  // Active Quest State
  const [cameraMode, setCameraMode] = useState<'none' | 'scan_before' | 'verify_after'>('none');
  const [beforeImage, setBeforeImage] = useState<string>('');
  const [afterImage, setAfterImage] = useState<string>('');
  const [roomType, setRoomType] = useState<RoomType>('bedroom');
  const [monsters, setMonsters] = useState<MonsterItem[]>([]);
  const [messBefore, setMessBefore] = useState<number>(0);
  const [messAfter, setMessAfter] = useState<number>(0);
  const [improvement, setImprovement] = useState<number>(0);
  const [grade, setGrade] = useState<GradeType>('B');
  const [commentary, setCommentary] = useState<string>('');
  const [remainingClutter, setRemainingClutter] = useState<string[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  const [earnedXpTotal, setEarnedXpTotal] = useState<number>(0);
  const [lootDropped, setLootDropped] = useState<EquipmentId | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState<boolean>(false);
  const [fallbackErrorMessage, setFallbackErrorMessage] = useState<string | undefined>();
  const [isDuelRace, setIsDuelRace] = useState<boolean>(false);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGemVaultOpen, setIsGemVaultOpen] = useState(false);

  // Session timer ticker
  useEffect(() => {
    if (screen !== 'quest' || sessionStartTime === 0) return;
    const interval = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [screen, sessionStartTime]);

  // Save profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [profile]);

  // Apply theme to document
  useEffect(() => {
    if (profile.theme === 'light') {
      document.documentElement.classList.add('theme-light');
      document.body.classList.remove('bg-[#14141C]', 'text-[#F2F1F6]');
      document.body.classList.add('bg-app', 'text-main');
    } else {
      document.documentElement.classList.remove('theme-light');
      document.body.classList.remove('bg-app', 'text-main');
      document.body.classList.add('bg-[#14141C]', 'text-[#F2F1F6]');
    }
  }, [profile.theme]);

  // Initialize and check Firestore connection & Auth listener
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setProfile((prev) => {
          const updated = {
            ...prev,
            id: user.uid,
            displayName: user.displayName || prev.displayName,
            email: user.email || undefined,
          };
          syncScoreToLeaderboard({
            id: user.uid,
            displayName: updated.displayName,
            avatar: updated.avatar,
            equippedItem: updated.equippedItem,
            weekXp: updated.weekXp,
            totalXp: updated.xp,
            streak: updated.streak,
          });
          return updated;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Daily & Weekly resets and Streak Shield protection
  useEffect(() => {
    const today = getTodayKey();
    const yesterday = getYesterdayKey();
    const monday = getMondayKey();

    setProfile((prev) => {
      let updated = { ...prev };

      // Daily quest counter reset
      if (prev.dailyQuestDay !== today) {
        updated.dailyQuestDay = today;
        updated.dailyQuestCount = 0;
      }

      // Weekly score reset
      if (prev.weekStart !== monday) {
        updated.weekStart = monday;
        updated.weekXp = 0;
        updated.checkedInDays = [];
      }

      // Streak check with Shield protection
      if (prev.lastPlayedDay !== today && prev.lastPlayedDay !== yesterday) {
        if (prev.boosters.hasStreakShield) {
          // Consume streak shield instead of resetting streak!
          updated.boosters = { ...prev.boosters, hasStreakShield: false };
        } else {
          updated.streak = 1;
        }
      }

      return updated;
    });
  }, []);

  // Handler: Manual Daily Check-In
  const handleCheckInToday = () => {
    const today = getTodayKey();
    setProfile((prev) => {
      const alreadyChecked = prev.checkedInDays.includes(today);
      if (alreadyChecked) return prev;

      const nextStreak = prev.streak + 1;
      const nextChecked = [...prev.checkedInDays, today];
      const nextXp = prev.xp + 10;
      const nextCoins = prev.coins + 5;

      return {
        ...prev,
        streak: nextStreak,
        lastPlayedDay: today,
        checkedInDays: nextChecked,
        xp: nextXp,
        coins: nextCoins,
      };
    });
  };

  // Gem Vault Boost Handlers
  const handleActivateStreakShield = () => {
    setProfile((prev) => {
      if (prev.gems < 5) return prev;
      return {
        ...prev,
        gems: prev.gems - 5,
        boosters: { ...prev.boosters, hasStreakShield: true },
      };
    });
  };

  const handleActivateXpBoost = () => {
    setProfile((prev) => {
      if (prev.gems < 4) return prev;
      return {
        ...prev,
        gems: prev.gems - 4,
        boosters: {
          ...prev.boosters,
          xpBoostSessionsLeft: prev.boosters.xpBoostSessionsLeft + 2,
        },
      };
    });
  };

  const handleTransmuteCoins = () => {
    setProfile((prev) => {
      if (prev.gems < 2) return prev;
      return {
        ...prev,
        gems: prev.gems - 2,
        coins: prev.coins + 150,
      };
    });
  };

  const handleActivateRadar = () => {
    setProfile((prev) => {
      if (prev.gems < 3) return prev;
      return {
        ...prev,
        gems: prev.gems - 3,
        boosters: { ...prev.boosters, hasRadarActive: true },
      };
    });
  };

  // Handler: Start Quest (opens camera)
  const handleStartQuest = (isDuel = false) => {
    setIsDuelRace(isDuel);
    setCameraMode('scan_before');
  };

  // Handler: Before Photo Captured
  const handleBeforePhotoCaptured = async (imageDataUrl: string) => {
    setCameraMode('none');
    setBeforeImage(imageDataUrl);
    setScreen('scan');
    setIsFallbackMode(false);
    setFallbackErrorMessage(undefined);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imageDataUrl }),
      });

      const json = await res.json();

      if (res.ok && json.success && json.data) {
        const data = json.data;
        const initialMonsters: MonsterItem[] = (data.monsters || []).map((m: any, idx: number) => ({
          id: `monster-${idx}-${Date.now()}`,
          name: m.name || 'Clutter Cluster',
          label: m.label || 'Unsorted items',
          task: m.task || 'Place into designated storage',
          minutes: Number(m.minutes) || 4,
          xp: Number(m.xp) || 20,
          box: m.box || [200, 200, 600, 600],
          shape: m.shape || 'ghost',
          color: m.color || '#8b5cf6',
          completed: false,
        }));

        setMessBefore(data.mess_score || 55);
        setRoomType(data.room_type || 'bedroom');
        setCommentary(data.commentary || 'Visual entropy detected across central surfaces.');
        setMonsters(initialMonsters);
        setSessionStartTime(Date.now());
        setSessionDuration(0);
        setEarnedXpTotal(0);

        setProfile((prev) => ({
          ...prev,
          apiTelemetry: {
            ...prev.apiTelemetry,
            calls: prev.apiTelemetry.calls + 1,
          },
        }));

        setScreen('quest');
        return;
      } else {
        throw new Error(json.message || 'Vision scan returned non-success response');
      }
    } catch (err: unknown) {
      console.warn('Falling back to edge density engine:', err);
      const edgeScore = await calculateEdgeDensity(imageDataUrl);
      const fallbackMonsters = generateFallbackMonsters(edgeScore);

      setMessBefore(edgeScore);
      setRoomType('bedroom');
      setCommentary('Luminance gradient and edge density thresholding active.');
      setMonsters(fallbackMonsters);
      setSessionStartTime(Date.now());
      setSessionDuration(0);
      setEarnedXpTotal(0);
      setIsFallbackMode(true);
      setFallbackErrorMessage(err instanceof Error ? err.message : 'Fallback mode');

      setProfile((prev) => ({
        ...prev,
        apiTelemetry: {
          ...prev.apiTelemetry,
          fallbackCount: prev.apiTelemetry.fallbackCount + 1,
        },
      }));

      setScreen('quest');
    }
  };

  // Handler: Toggle Task in Quest
  const handleTaskToggle = (monsterId: string, earnedXp: number) => {
    setMonsters((prev) =>
      prev.map((m) => (m.id === monsterId ? { ...m, completed: true } : m))
    );
    setEarnedXpTotal((prev) => prev + earnedXp);

    setProfile((prev) => {
      const nextCount = Math.min(3, prev.dailyQuestCount + 1);
      const isDailyCompletedJustNow = prev.dailyQuestCount < 3 && nextCount === 3;
      return {
        ...prev,
        monstersBeaten: prev.monstersBeaten + 1,
        dailyQuestCount: nextCount,
        gems: isDailyCompletedJustNow ? prev.gems + 1 : prev.gems,
      };
    });
  };

  // Handler: Proceed to Verify
  const handleProceedToVerify = () => {
    setCameraMode('verify_after');
  };

  // Handler: After Photo Captured
  const handleAfterPhotoCaptured = async (afterDataUrl: string) => {
    setCameraMode('none');
    setAfterImage(afterDataUrl);
    setScreen('verify');

    const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
    setSessionDuration(duration);

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beforeBase64: beforeImage,
          afterBase64: afterDataUrl,
          expectedRoomType: roomType,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success && json.data) {
        const result = json.data;
        const pass = Boolean(result.pass);
        const mBefore = Number(result.mess_before) || messBefore;
        const mAfter = Number(result.mess_after) || 15;
        const imp = Number(result.improvement) || (mBefore - mAfter);

        setMessBefore(mBefore);
        setMessAfter(mAfter);
        setImprovement(imp);
        setCommentary(result.commentary || 'Verification analysis concluded.');
        setRemainingClutter(result.remaining || []);

        if (pass && imp >= 8) {
          let finalGrade: GradeType = 'B';
          if (imp >= 50 && duration < 600) finalGrade = 'S';
          else if (imp >= 30) finalGrade = 'A';
          else if (imp >= 15) finalGrade = 'B';
          else finalGrade = 'C';

          setGrade(finalGrade);

          // Calculate rewards with 2x XP booster if active!
          const isXpBoostActive = profile.boosters.xpBoostSessionsLeft > 0;
          const boostMultiplier = isXpBoostActive ? 2 : 1;

          const baseBonus = 50;
          const speedBonus = duration < 600 ? 30 : 0;
          const duelBonus = isDuelRace ? 40 : 0;
          const totalXp = Math.round((earnedXpTotal + baseBonus + speedBonus + duelBonus) * boostMultiplier);
          const coinsAwarded = Math.round(totalXp * 0.5);
          const gemsAwarded = finalGrade === 'S' ? 3 : finalGrade === 'A' ? 2 : 1;

          // Loot Drop: 75% chance (or 100% if radar boost active)
          const lootProbability = profile.boosters.hasRadarActive ? 1.0 : 0.75;
          let lootDropItem: EquipmentId | null = null;
          if (Math.random() < lootProbability) {
            const allItems: EquipmentId[] = [
              'cap', 'shades', 'tophat', 'bandana', 'beret', 'headset', 'fedora',
              'helmet', 'visor', 'crown', 'halo', 'kabuto', 'spacehelm', 'valkyrie'
            ];
            const unowned = allItems.filter((item) => !profile.ownedEquipment.includes(item));
            if (unowned.length > 0) {
              lootDropItem = unowned[Math.floor(Math.random() * unowned.length)];
            }
          }
          setLootDropped(lootDropItem);

          applySessionSuccess(mBefore, mAfter, imp, finalGrade, duration, totalXp, coinsAwarded, gemsAwarded, lootDropItem, false, result.commentary, isXpBoostActive);
          setScreen('result_pass');
        } else {
          setScreen('result_fail');
        }
        return;
      } else {
        throw new Error(json.message || 'Vision verification failed');
      }
    } catch (err: unknown) {
      console.warn('Fallback verification active:', err);
      const afterEdge = await calculateEdgeDensity(afterDataUrl);
      const imp = Math.round(messBefore - afterEdge);
      setMessAfter(afterEdge);
      setImprovement(imp);
      setIsFallbackMode(true);
      setFallbackErrorMessage(err instanceof Error ? err.message : 'Fallback verification');

      if (imp >= 8) {
        let finalGrade: GradeType = imp >= 40 ? 'A' : imp >= 15 ? 'B' : 'C';
        setGrade(finalGrade);

        const isXpBoostActive = profile.boosters.xpBoostSessionsLeft > 0;
        const boostMultiplier = isXpBoostActive ? 2 : 1;
        const totalXp = Math.round((earnedXpTotal + 50 + (duration < 600 ? 30 : 0) + (isDuelRace ? 40 : 0)) * boostMultiplier);
        const coinsAwarded = Math.round(totalXp * 0.5);
        const gemsAwarded = 1;

        applySessionSuccess(messBefore, afterEdge, imp, finalGrade, duration, totalXp, coinsAwarded, gemsAwarded, null, true, 'Luminance edge density confirms valid reduction.', isXpBoostActive);
        setScreen('result_pass');
      } else {
        setCommentary('Insufficient change detected in pixel edge density gradient.');
        setRemainingClutter(['Visible clutter density remains unchanged across key coordinates.']);
        setScreen('result_fail');
      }
    }
  };

  const applySessionSuccess = (
    mBefore: number,
    mAfter: number,
    imp: number,
    finalGrade: GradeType,
    duration: number,
    xpAward: number,
    coinsAward: number,
    gemsAward: number,
    loot: EquipmentId | null,
    fallback: boolean,
    comm: string,
    usedXpBoost: boolean
  ) => {
    const today = getTodayKey();
    const newSessionRecord: SessionRecord = {
      id: `session-${Date.now()}`,
      date: new Date().toISOString(),
      roomType,
      messBefore: mBefore,
      messAfter: mAfter,
      improvement: imp,
      grade: finalGrade,
      durationSeconds: duration,
      xpEarned: xpAward,
      coinsEarned: coinsAward,
      gemsEarned: gemsAward,
      commentary: comm,
      isFallback: fallback,
      beforeImage,
      afterImage,
      monstersCount: monsters.length,
    };

    setProfile((prev) => {
      const nextXp = prev.xp + xpAward;
      const nextWeekXp = prev.weekXp + xpAward;
      const nextCoins = prev.coins + coinsAward;
      const nextGems = prev.gems + gemsAward;
      const nextRooms = prev.roomsCompleted + 1;
      const nextMessCleared = prev.totalMessCleared + imp;
      const nextStreak = prev.lastPlayedDay === today ? prev.streak : prev.streak + 1;
      const nextBestTime = prev.bestTimeSeconds === 0 ? duration : Math.min(prev.bestTimeSeconds, duration);
      const nextOwned = loot && !prev.ownedEquipment.includes(loot) ? [...prev.ownedEquipment, loot] : prev.ownedEquipment;
      const nextLevel = Math.max(1, Math.floor(nextXp / 250) + 1);

      // Check-in day
      const nextCheckedDays = prev.checkedInDays.includes(today) ? prev.checkedInDays : [...prev.checkedInDays, today];

      // Consume boosters
      const nextBoosters = {
        ...prev.boosters,
        xpBoostSessionsLeft: usedXpBoost ? Math.max(0, prev.boosters.xpBoostSessionsLeft - 1) : prev.boosters.xpBoostSessionsLeft,
        hasRadarActive: false, // radar consumed on quest complete
      };

      const nextHistory = [newSessionRecord, ...prev.history].slice(0, 50);

      const updatedProfile: UserProfile = {
        ...prev,
        level: nextLevel,
        xp: nextXp,
        weekXp: nextWeekXp,
        coins: nextCoins,
        gems: nextGems,
        streak: nextStreak,
        lastPlayedDay: today,
        checkedInDays: nextCheckedDays,
        boosters: nextBoosters,
        totalMessCleared: nextMessCleared,
        roomsCompleted: nextRooms,
        bestTimeSeconds: nextBestTime,
        ownedEquipment: nextOwned,
        history: nextHistory,
      };

      syncScoreToLeaderboard({
        id: updatedProfile.id,
        displayName: updatedProfile.displayName,
        avatar: updatedProfile.avatar,
        equippedItem: updatedProfile.equippedItem,
        weekXp: updatedProfile.weekXp,
        totalXp: updatedProfile.xp,
        streak: updatedProfile.streak,
      });

      return updatedProfile;
    });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between bg-app text-main transition-colors">
      {screen !== 'welcome' && (
        <TopHeader
          profile={profile}
          currentScreen={screen}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenGemVault={() => setIsGemVaultOpen(true)}
          onNavigate={(s) => setScreen(s)}
          onToggleTheme={() => {
            setProfile((p) => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' }));
          }}
        />
      )}

      <main className="flex-1">
        {screen === 'welcome' && (
          <WelcomeView
            onStart={() => {
              setProfile((p) => ({ ...p, hasCompletedOnboarding: true }));
              setScreen('home');
            }}
            hapticsEnabled={profile.hapticsEnabled}
          />
        )}

        {screen === 'home' && (
          <HomeView
            profile={profile}
            onStartQuest={() => handleStartQuest(false)}
            onOpenDuel={() => setScreen('duel')}
            onViewHistory={() => setScreen('history')}
            onCheckInToday={handleCheckInToday}
            onOpenGemVault={() => setIsGemVaultOpen(true)}
          />
        )}

        {screen === 'scan' && (
          <ScanView imagePreviewUrl={beforeImage} isFallback={isFallbackMode} />
        )}

        {screen === 'quest' && (
          <QuestView
            roomImage={beforeImage}
            roomType={roomType}
            monsters={monsters}
            commentary={commentary}
            onTaskToggle={handleTaskToggle}
            onProceedToVerify={handleProceedToVerify}
            soundEnabled={profile.soundEnabled}
            hapticsEnabled={profile.hapticsEnabled}
            totalDurationSeconds={sessionDuration}
            xpMultiplierBonus={profile.boosters.xpBoostSessionsLeft > 0 ? 2 : 1}
          />
        )}

        {screen === 'verify' && (
          <VerifyView beforeImage={beforeImage} afterImage={afterImage} />
        )}

        {screen === 'result_pass' && (
          <ResultPassView
            grade={grade}
            beforeImage={beforeImage}
            afterImage={afterImage}
            messBefore={messBefore}
            messAfter={messAfter}
            improvement={improvement}
            durationSeconds={sessionDuration}
            xpEarned={Math.round((earnedXpTotal + 50 + (sessionDuration < 600 ? 30 : 0) + (isDuelRace ? 40 : 0)) * (profile.boosters.xpBoostSessionsLeft > 0 ? 2 : 1))}
            coinsEarned={Math.round((earnedXpTotal + 50) * 0.5)}
            gemsEarned={grade === 'S' ? 3 : grade === 'A' ? 2 : 1}
            lootDrop={lootDropped}
            isFallback={isFallbackMode}
            fallbackError={fallbackErrorMessage}
            commentary={commentary}
            soundEnabled={profile.soundEnabled}
            hapticsEnabled={profile.hapticsEnabled}
            onDone={() => setScreen('home')}
            onOpenLocker={() => setScreen('locker')}
          />
        )}

        {screen === 'result_fail' && (
          <ResultFailView
            beforeImage={beforeImage}
            afterImage={afterImage}
            messBefore={messBefore}
            messAfter={messAfter}
            improvement={improvement}
            commentary={commentary}
            remaining={remainingClutter}
            onRetryPhoto={() => setCameraMode('verify_after')}
            onAbandon={() => setScreen('home')}
            soundEnabled={profile.soundEnabled}
            hapticsEnabled={profile.hapticsEnabled}
          />
        )}

        {screen === 'history' && (
          <HistoryView
            history={profile.history}
            totalMessCleared={profile.totalMessCleared}
            onBack={() => setScreen('home')}
            hapticsEnabled={profile.hapticsEnabled}
          />
        )}

        {screen === 'league' && (
          <LeagueView
            profile={profile}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {screen === 'locker' && (
          <LockerView
            profile={profile}
            onEquipItem={(id) => setProfile((p) => ({ ...p, equippedItem: id }))}
            onBuyItem={(id, cost) => {
              setProfile((p) => ({
                ...p,
                coins: p.coins - cost,
                ownedEquipment: [...p.ownedEquipment, id],
                equippedItem: id,
              }));
            }}
            onOpenGemVault={() => setIsGemVaultOpen(true)}
          />
        )}

        {screen === 'profile' && (
          <ProfileView
            profile={profile}
            onUpdateAvatar={(avatar) => setProfile((p) => ({ ...p, avatar }))}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenGemVault={() => setIsGemVaultOpen(true)}
          />
        )}

        {screen === 'duel' && (
          <DuelView
            profile={profile}
            onStartCleaningDuel={() => handleStartQuest(true)}
            onBack={() => setScreen('home')}
          />
        )}
      </main>

      <BottomNav
        currentScreen={screen}
        onNavigate={(s) => setScreen(s)}
        profile={profile}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenGemVault={() => setIsGemVaultOpen(true)}
        onToggleTheme={() => {
          setProfile((p) => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' }));
        }}
      />

      {cameraMode !== 'none' && (
        <CameraCapture
          title={cameraMode === 'scan_before' ? 'Photograph Room Mess' : 'Photograph Verified Clean'}
          hint={cameraMode === 'scan_before' ? 'Capture the clutter clusters' : 'Match the original camera angle'}
          onCapture={(img) => {
            if (cameraMode === 'scan_before') {
              handleBeforePhotoCaptured(img);
            } else {
              handleAfterPhotoCaptured(img);
            }
          }}
          onCancel={() => setCameraMode('none')}
        />
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentName={profile.displayName}
        onUpdateName={(name) => {
          setProfile((p) => ({ ...p, displayName: name }));
          syncScoreToLeaderboard({
            id: profile.id,
            displayName: name,
            avatar: profile.avatar,
            equippedItem: profile.equippedItem,
            weekXp: profile.weekXp,
            totalXp: profile.xp,
            streak: profile.streak,
          });
        }}
        onUserAuthenticated={({ uid, displayName, email }) => {
          setProfile((p) => ({
            ...p,
            id: uid,
            displayName: displayName || p.displayName,
            email,
          }));
        }}
        hapticsEnabled={profile.hapticsEnabled}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onUpdateProfile={(updated) => setProfile((p) => ({ ...p, ...updated }))}
        onOpenAuth={() => setIsAuthOpen(true)}
        onResetData={() => {
          setProfile(DEFAULT_PROFILE);
          setScreen('welcome');
        }}
      />

      {/* Gem Power Vault Modal */}
      <GemVaultModal
        isOpen={isGemVaultOpen}
        onClose={() => setIsGemVaultOpen(false)}
        profile={profile}
        onActivateStreakShield={handleActivateStreakShield}
        onActivateXpBoost={handleActivateXpBoost}
        onTransmuteCoins={handleTransmuteCoins}
        onActivateRadar={handleActivateRadar}
        hapticsEnabled={profile.hapticsEnabled}
        soundEnabled={profile.soundEnabled}
      />
    </div>
  );
}
