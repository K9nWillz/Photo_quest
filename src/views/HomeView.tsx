import React from 'react';
import { UserProfile } from '../types';
import {
  CameraIcon,
  FlameIcon,
  GemIcon,
  CheckCircleIcon,
  ClockIcon,
  ZapIcon,
  ChevronRightIcon,
  SwordsIcon,
  SparklesIcon,
  ShieldIcon,
} from '../components/icons';
import { DailyStreakCard } from '../components/DailyStreakCard';
import { triggerHaptic } from '../utils/audio';

interface HomeViewProps {
  profile: UserProfile;
  onStartQuest: () => void;
  onOpenDuel: () => void;
  onViewHistory: () => void;
  onCheckInToday: () => void;
  onOpenGemVault: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  onStartQuest,
  onOpenDuel,
  onViewHistory,
  onCheckInToday,
  onOpenGemVault,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatRelativeTime = (isoDate: string) => {
    try {
      const diffMs = Date.now() - new Date(isoDate).getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="px-4 sm:px-8 py-6 max-w-5xl mx-auto pb-28 select-none transition-colors">
      {/* Editorial Header */}
      <div className="mb-6">
        <p className="text-xs font-mono tracking-widest text-sub uppercase">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>
        <div className="flex flex-wrap items-baseline gap-2 mt-1">
          <h1 className="font-serif text-3xl sm:text-5xl text-main font-normal tracking-tight">
            {getGreeting()},{' '}
            <span className="italic text-account font-serif">{profile.displayName}</span>
          </h1>
        </div>
      </div>

      {/* Active Boosters Ribbon (if user unlocked via Gem Vault) */}
      {(profile.boosters.xpBoostSessionsLeft > 0 || profile.boosters.hasStreakShield || profile.boosters.hasRadarActive) && (
        <div className="mb-5 p-3 rounded-2xl bg-sky-500/10 border border-sky-500/25 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-sky-400 flex items-center gap-1">
              <SparklesIcon size={14} /> ACTIVE GEM BOOSTS:
            </span>
            {profile.boosters.xpBoostSessionsLeft > 0 && (
              <span className="px-2 py-0.5 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[10px] font-mono font-bold">
                ⚡ 2x XP ({profile.boosters.xpBoostSessionsLeft} Quests Left)
              </span>
            )}
            {profile.boosters.hasStreakShield && (
              <span className="px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-mono font-bold">
                🛡️ Streak Shield Armed
              </span>
            )}
            {profile.boosters.hasRadarActive && (
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                📡 Clutter Radar Active
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenGemVault}
            className="text-[11px] font-mono font-semibold text-sky-400 hover:text-sky-300 underline"
          >
            Manage Vault
          </button>
        </div>
      )}

      {/* Responsive Grid for PC & Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Column: Streaks and Daily Quest */}
        <div className="space-y-5">
          {/* Overhauled Daily Streak Card */}
          <DailyStreakCard
            streak={profile.streak}
            lastPlayedDay={profile.lastPlayedDay}
            checkedInDays={profile.checkedInDays}
            hasStreakShield={profile.boosters.hasStreakShield}
            onCheckInToday={onCheckInToday}
            hapticsEnabled={profile.hapticsEnabled}
            soundEnabled={profile.soundEnabled}
          />

          {/* Daily Routine Quest */}
          <div className="p-5 rounded-2xl bg-card border border-theme shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircleIcon size={18} className="text-violet-500" />
                <span className="text-xs font-semibold text-main font-mono uppercase tracking-wider">
                  Daily Habit Target
                </span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-500 text-[11px] font-mono font-bold">
                <GemIcon size={12} />
                <span>+1 Gem</span>
              </div>
            </div>

            <p className="text-xs text-sub mb-3">
              Clear 3 distinct physical clutter clusters during today's practice
            </p>

            {/* Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-card-subtle border border-theme overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${Math.min(100, (profile.dailyQuestCount / 3) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2 text-[10px] font-mono text-dim">
              <span>{profile.dailyQuestCount} of 3 completed today</span>
              <span className="text-account font-semibold">
                {profile.dailyQuestCount >= 3 ? 'Target Achieved' : 'In Progress'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Actions, Duel Teaser, and Proof Logs */}
        <div className="space-y-5">
          {/* Primary Action Button (Start Quest) */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(20, profile.hapticsEnabled);
              onStartQuest();
            }}
            className="w-full p-5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-between shadow-xl shadow-violet-600/25 active:scale-[0.99] transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                <CameraIcon size={24} />
              </div>
              <div className="text-left">
                <p className="text-base font-semibold tracking-tight">Start Cleaning Quest</p>
                <p className="text-xs text-violet-200">Photograph mess • Gemini AI analysis</p>
              </div>
            </div>
            <ChevronRightIcon size={22} className="text-violet-200 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Clean-Off Duel Teaser */}
          <div
            onClick={() => {
              triggerHaptic(15, profile.hapticsEnabled);
              onOpenDuel();
            }}
            className="p-4 sm:p-5 rounded-2xl bg-card border border-rose-500/30 flex items-center justify-between cursor-pointer hover:border-rose-500/50 shadow-sm transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-500">
                <SwordsIcon size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-main font-mono uppercase tracking-wider">
                    Clean-Off Duel
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-rose-500/20 text-rose-500 font-bold">
                    LIVE
                  </span>
                </div>
                <p className="text-[11px] text-sub mt-0.5">Race a peer in verified cleaning speed</p>
              </div>
            </div>
            <ChevronRightIcon size={18} className="text-dim" />
          </div>

          {/* Recent Proof Logs */}
          <div className="p-5 rounded-2xl bg-card border border-theme shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-xs font-mono uppercase tracking-wider text-sub">
                Recent Verification Logs
              </h2>
              <button
                type="button"
                onClick={onViewHistory}
                className="text-xs text-account hover:opacity-80 font-mono font-semibold"
              >
                View all ({profile.history.length})
              </button>
            </div>

            {profile.history.length === 0 ? (
              <div className="p-6 rounded-xl bg-card-subtle border border-theme text-center">
                <p className="text-xs text-dim font-mono">No verified sessions recorded yet.</p>
                <p className="text-[11px] text-dim mt-1">Start your first quest above to populate this ledger.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {profile.history.slice(0, 3).map((session) => (
                  <div
                    key={session.id}
                    className="p-3 rounded-xl bg-card-subtle border border-theme flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {/* Grade Badge */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-serif text-lg font-bold ${
                          session.grade === 'S'
                            ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                            : session.grade === 'A'
                            ? 'bg-violet-500/15 text-violet-500 border border-violet-500/30'
                            : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                        }`}
                      >
                        {session.grade}
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-main capitalize">
                          {session.roomType.replace('_', ' ')}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-dim">
                          <span>{formatRelativeTime(session.date)}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <ClockIcon size={10} />
                            {Math.round(session.durationSeconds / 60)}m
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-emerald-500">
                        +{session.improvement}%
                      </span>
                      <p className="font-mono text-[10px] text-dim">+{session.xpEarned} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
