import React, { useState, useEffect } from 'react';
import { LeaderboardPlayer, UserProfile } from '../types';
import { Avatar } from '../components/avatars';
import { CrownIcon, TrophyIcon, FlameIcon, RefreshCwIcon, UsersIcon } from '../components/icons';
import { fetchLiveLeaderboard } from '../firebase';
import { triggerHaptic } from '../utils/audio';

interface LeagueViewProps {
  profile: UserProfile;
  onOpenAuth: () => void;
}

const BASE_LEAGUE_PLAYERS: LeaderboardPlayer[] = [
  {
    id: 'seed-1',
    displayName: 'Aria Thorne',
    avatar: 'fox',
    equippedItem: 'crown',
    weekXp: 1840,
    totalXp: 5880,
    streak: 18,
    delta: 1,
  },
  {
    id: 'seed-2',
    displayName: 'Marcus Vance',
    avatar: 'owl',
    equippedItem: 'headset',
    weekXp: 1420,
    totalXp: 4540,
    streak: 12,
    delta: 0,
  },
  {
    id: 'seed-3',
    displayName: 'Elena Rostova',
    avatar: 'geode',
    equippedItem: 'shades',
    weekXp: 1290,
    totalXp: 4120,
    streak: 9,
    delta: -1,
  },
  {
    id: 'seed-4',
    displayName: 'Kaelen Mori',
    avatar: 'comet',
    equippedItem: 'cap',
    weekXp: 980,
    totalXp: 3130,
    streak: 6,
    delta: 2,
  },
  {
    id: 'seed-5',
    displayName: 'Dr. Evelyn Cross',
    avatar: 'whale',
    equippedItem: 'tophat',
    weekXp: 860,
    totalXp: 2750,
    streak: 5,
    delta: 0,
  },
  {
    id: 'seed-6',
    displayName: 'Ren Tanaka',
    avatar: 'lotus',
    equippedItem: 'bandana',
    weekXp: 740,
    totalXp: 2360,
    streak: 4,
    delta: -1,
  },
  {
    id: 'seed-7',
    displayName: 'Soren Lind',
    avatar: 'ember',
    equippedItem: 'visor',
    weekXp: 620,
    totalXp: 1980,
    streak: 3,
    delta: 0,
  },
  {
    id: 'seed-8',
    displayName: 'Cora Mercer',
    avatar: 'frost',
    equippedItem: 'beret',
    weekXp: 510,
    totalXp: 1630,
    streak: 2,
    delta: 1,
  },
  {
    id: 'seed-9',
    displayName: 'Julian Hayes',
    avatar: 'moss',
    equippedItem: 'none',
    weekXp: 430,
    totalXp: 1370,
    streak: 2,
    delta: 0,
  },
];

export const LeagueView: React.FC<LeagueViewProps> = ({ profile, onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'friends' | 'alltime'>('weekly');
  const [livePlayers, setLivePlayers] = useState<LeaderboardPlayer[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadLeaderboard = async () => {
    setIsRefreshing(true);
    const remote = await fetchLiveLeaderboard();
    setLivePlayers(remote);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadLeaderboard();
  }, [profile.weekXp, profile.xp]);

  const userPlayer: LeaderboardPlayer = {
    id: profile.id,
    displayName: profile.displayName,
    avatar: profile.avatar,
    equippedItem: profile.equippedItem,
    weekXp: profile.weekXp,
    totalXp: profile.xp,
    streak: profile.streak,
    isUser: true,
    delta: 0,
  };

  const combined: LeaderboardPlayer[] = [...BASE_LEAGUE_PLAYERS];

  livePlayers.forEach((lp) => {
    const existingIdx = combined.findIndex((p) => p.id === lp.id || p.displayName === lp.displayName);
    if (existingIdx >= 0) {
      combined[existingIdx] = { ...combined[existingIdx], ...lp };
    } else {
      combined.push(lp);
    }
  });

  const userIndex = combined.findIndex((p) => p.isUser || p.id === userPlayer.id);
  if (userIndex >= 0) {
    combined[userIndex] = userPlayer;
  } else {
    combined.push(userPlayer);
  }

  let displayList = combined.map((p) => {
    let score = p.weekXp;
    if (activeTab === 'alltime') {
      score = p.totalXp > 0 ? p.totalXp : Math.round(p.weekXp * 3.2);
    }
    return { ...p, calculatedScore: score };
  });

  if (activeTab === 'friends') {
    displayList = displayList.filter((_, idx) => idx % 2 === 0 || _.isUser);
  }

  displayList.sort((a, b) => b.calculatedScore - a.calculatedScore);
  displayList = displayList.map((p, idx) => ({ ...p, rank: idx + 1 }));

  const top3 = displayList.slice(0, 3);
  const remaining = displayList.slice(3);

  const first = top3[0];
  const second = top3[1];
  const third = top3[2];

  return (
    <div className="px-4 sm:px-8 py-6 max-w-5xl mx-auto space-y-6 pb-28 select-none transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono tracking-widest uppercase text-amber-500 font-bold">
            Competitive League
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-main font-normal">Diamond Division</h1>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic(10, profile.hapticsEnabled);
            loadLeaderboard();
          }}
          className="w-9 h-9 rounded-xl bg-card border border-theme flex items-center justify-center text-sub hover:text-main"
          aria-label="Refresh leaderboard"
        >
          <RefreshCwIcon size={14} className={isRefreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 p-1 rounded-2xl bg-card border border-theme text-xs font-mono max-w-md mx-auto">
        <button
          type="button"
          onClick={() => {
            triggerHaptic(10, profile.hapticsEnabled);
            setActiveTab('weekly');
          }}
          className={`py-2 rounded-xl transition-all ${
            activeTab === 'weekly' ? 'bg-account text-account font-bold shadow-sm' : 'text-sub'
          }`}
        >
          Weekly
        </button>
        <button
          type="button"
          onClick={() => {
            triggerHaptic(10, profile.hapticsEnabled);
            setActiveTab('friends');
          }}
          className={`py-2 rounded-xl transition-all ${
            activeTab === 'friends' ? 'bg-account text-account font-bold shadow-sm' : 'text-sub'
          }`}
        >
          Friends
        </button>
        <button
          type="button"
          onClick={() => {
            triggerHaptic(10, profile.hapticsEnabled);
            setActiveTab('alltime');
          }}
          className={`py-2 rounded-xl transition-all ${
            activeTab === 'alltime' ? 'bg-account text-account font-bold shadow-sm' : 'text-sub'
          }`}
        >
          All-Time
        </button>
      </div>

      <p className="text-[10px] font-mono text-dim text-center">
        Weekly reset occurs Monday at 00:00 UTC • Verified points only
      </p>

      {/* 3D-Feel Rising Podium Towers */}
      {top3.length >= 3 && (
        <div className="pt-8 pb-3 px-2 flex items-end justify-center gap-2 sm:gap-6 max-w-xl mx-auto">
          {/* 2nd Place */}
          {second && (
            <div className="flex-1 flex flex-col items-center">
              <Avatar
                type={second.avatar}
                equippedItem={second.equippedItem}
                size={48}
                className="mb-1.5 shadow-md"
              />
              <span className="text-xs font-semibold text-main truncate max-w-[90px]">
                {second.displayName}
              </span>
              <span className="text-[10px] font-mono text-sub">
                {second.calculatedScore} XP
              </span>
              <div className="w-full h-20 sm:h-24 rounded-t-2xl bg-card border-t-2 border-zinc-400 flex flex-col items-center justify-center mt-2 shadow-md">
                <span className="font-serif text-2xl text-sub font-bold">2</span>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {first && (
            <div className="flex-1 flex flex-col items-center -mt-6">
              <CrownIcon size={22} className="text-amber-500 mb-1 animate-bounce" />
              <Avatar
                type={first.avatar}
                equippedItem={first.equippedItem}
                size={58}
                showHalo
                className="mb-1.5 ring-2 ring-amber-400 shadow-xl"
              />
              <span className="text-xs font-bold text-amber-500 truncate max-w-[100px]">
                {first.displayName}
              </span>
              <span className="text-[10px] font-mono text-sub font-semibold">
                {first.calculatedScore} XP
              </span>
              <div className="w-full h-28 sm:h-36 rounded-t-2xl bg-amber-500/15 border-t-2 border-amber-400 flex flex-col items-center justify-center mt-2 shadow-lg">
                <span className="font-serif text-3xl text-amber-500 font-bold">1</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {third && (
            <div className="flex-1 flex flex-col items-center">
              <Avatar
                type={third.avatar}
                equippedItem={third.equippedItem}
                size={48}
                className="mb-1.5 shadow-md"
              />
              <span className="text-xs font-semibold text-main truncate max-w-[90px]">
                {third.displayName}
              </span>
              <span className="text-[10px] font-mono text-sub">
                {third.calculatedScore} XP
              </span>
              <div className="w-full h-16 sm:h-20 rounded-t-2xl bg-card border-t-2 border-amber-700/60 flex flex-col items-center justify-center mt-2 shadow-md">
                <span className="font-serif text-2xl text-amber-700 font-bold">3</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ranks 4+ Table (User highlighted in LIME GREEN!) */}
      <div className="space-y-2 max-w-2xl mx-auto">
        {remaining.map((player) => {
          const isUser = player.isUser;
          return (
            <div
              key={player.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                isUser
                  ? 'bg-account border-account ring-2 ring-[#84cc16] shadow-sm'
                  : 'bg-card border-theme hover:bg-card-elevated'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 text-center font-mono text-xs font-bold text-dim">
                  {player.rank}
                </div>

                <Avatar
                  type={player.avatar}
                  equippedItem={player.equippedItem}
                  showAccountRing={isUser}
                  size={38}
                  className="rounded-xl"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <p className={`text-xs font-semibold ${isUser ? 'text-account font-bold' : 'text-main'}`}>
                      {player.displayName}
                    </p>
                    {isUser && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#84cc16] text-black font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-dim">
                    <span className="flex items-center gap-0.5">
                      <FlameIcon size={10} className="text-amber-500" />
                      {player.streak}d
                    </span>
                    {player.delta !== undefined && player.delta !== 0 && (
                      <span className={player.delta > 0 ? 'text-emerald-500' : 'text-rose-500'}>
                        {player.delta > 0 ? `▲ +${player.delta}` : `▼ ${player.delta}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs font-bold text-main">
                  {player.calculatedScore}
                </span>
                <span className="text-[10px] font-mono text-dim ml-1">XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
