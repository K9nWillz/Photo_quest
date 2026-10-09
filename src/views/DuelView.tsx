import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Avatar } from '../components/avatars';
import { SwordsIcon, TrophyIcon, ArrowLeftIcon, ZapIcon, CameraIcon } from '../components/icons';
import { triggerHaptic } from '../utils/audio';

interface DuelViewProps {
  profile: UserProfile;
  onStartCleaningDuel: () => void;
  onBack: () => void;
}

export const DuelView: React.FC<DuelViewProps> = ({
  profile,
  onStartCleaningDuel,
  onBack,
}) => {
  const [matchStatus, setMatchStatus] = useState<'idle' | 'searching' | 'matched'>('idle');
  const [opponent, setOpponent] = useState<{ name: string; avatar: 'owl' | 'whale' | 'geode'; level: number } | null>(null);

  const startMatching = () => {
    triggerHaptic(20, profile.hapticsEnabled);
    setMatchStatus('searching');

    setTimeout(() => {
      setOpponent({
        name: 'Vesper Lind',
        avatar: 'owl',
        level: Math.max(1, profile.level),
      });
      setMatchStatus('matched');
      triggerHaptic([30, 20, 40], profile.hapticsEnabled);
    }, 1800);
  };

  return (
    <div className="px-4 sm:px-8 py-6 max-w-4xl mx-auto space-y-6 pb-28 select-none transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            triggerHaptic(10, profile.hapticsEnabled);
            onBack();
          }}
          className="w-9 h-9 rounded-xl bg-card border border-theme flex items-center justify-center text-sub hover:text-main"
        >
          <ArrowLeftIcon size={16} />
        </button>
        <div>
          <p className="text-[10px] font-mono tracking-widest uppercase text-rose-500 font-bold">
            Real-Time Versus
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-main font-normal">Clean-Off Duel</h1>
        </div>
      </div>

      <p className="text-xs text-sub leading-relaxed max-w-2xl">
        Challenge an online peer to simultaneous room decluttering. The operator with the highest verified improvement score claims <strong>+40 bonus XP</strong> and climbing rights.
      </p>

      {/* Duel Arena Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-rose-500/30 shadow-xl space-y-8">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {/* User Side */}
          <div className="flex flex-col items-center">
            <Avatar
              type={profile.avatar}
              equippedItem={profile.equippedItem}
              showAccountRing
              size={72}
              showHalo
              className="mb-2 shadow-lg ring-2 ring-[#84cc16]"
            />
            <span className="text-xs font-bold text-main truncate max-w-[100px]">
              {profile.displayName} (You)
            </span>
            <span className="text-[10px] font-mono text-account font-bold">Lvl {profile.level}</span>
          </div>

          {/* Versus Center */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/15 border-2 border-rose-500/40 flex items-center justify-center text-rose-500 font-serif text-xl font-bold">
              VS
            </div>
            <span className="text-[9px] font-mono text-dim mt-1">SPEED RUN</span>
          </div>

          {/* Opponent Side */}
          <div className="flex flex-col items-center">
            {opponent ? (
              <>
                <Avatar
                  type={opponent.avatar}
                  size={72}
                  showHalo
                  className="mb-2 shadow-lg ring-2 ring-rose-500/50"
                />
                <span className="text-xs font-bold text-main truncate max-w-[100px]">
                  {opponent.name}
                </span>
                <span className="text-[10px] font-mono text-rose-400 font-bold">Lvl {opponent.level}</span>
              </>
            ) : (
              <>
                <div className="w-[72px] h-[72px] rounded-2xl bg-card-subtle border border-dashed border-theme flex items-center justify-center text-dim mb-2">
                  <SwordsIcon size={28} />
                </div>
                <span className="text-xs font-mono text-sub">Searching...</span>
                <span className="text-[10px] font-mono text-dim">Queued</span>
              </>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="max-w-md mx-auto">
          {matchStatus === 'idle' && (
            <button
              type="button"
              onClick={startMatching}
              className="w-full py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 active:scale-98 transition-all"
            >
              <SwordsIcon size={18} />
              <span>Search Match Queue</span>
            </button>
          )}

          {matchStatus === 'searching' && (
            <div className="p-4 rounded-2xl bg-card-subtle border border-theme text-center space-y-1">
              <p className="text-xs font-mono text-rose-500 font-bold animate-pulse">
                Pinging peer cleaner nodes…
              </p>
              <p className="text-[10px] text-sub font-mono">Calibrating rating parity</p>
            </div>
          )}

          {matchStatus === 'matched' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <p className="text-xs font-mono text-emerald-500 font-bold">
                  Match Verified: Ready to Clean
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(25, profile.hapticsEnabled);
                  onStartCleaningDuel();
                }}
                className="w-full py-4 px-6 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xl shadow-violet-600/20 active:scale-98 transition-all"
              >
                <CameraIcon size={18} />
                <span>Photograph Room & Start Match</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
