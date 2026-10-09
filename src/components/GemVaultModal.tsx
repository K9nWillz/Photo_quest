import React from 'react';
import { UserProfile } from '../types';
import { GemIcon, ShieldIcon, ZapIcon, CoinIcon, SparklesIcon, CrossIcon, CheckIcon, FlameIcon } from './icons';
import { triggerHaptic, playTaskCompleteTone } from '../utils/audio';

interface GemVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onActivateStreakShield: () => void;
  onActivateXpBoost: () => void;
  onTransmuteCoins: () => void;
  onActivateRadar: () => void;
  onReviveStreak?: () => void;
  hapticsEnabled: boolean;
  soundEnabled: boolean;
}

export const GemVaultModal: React.FC<GemVaultModalProps> = ({
  isOpen,
  onClose,
  profile,
  onActivateStreakShield,
  onActivateXpBoost,
  onTransmuteCoins,
  onActivateRadar,
  onReviveStreak,
  hapticsEnabled,
  soundEnabled,
}) => {
  if (!isOpen) return null;

  const handlePurchase = (cost: number, action: () => void) => {
    if (profile.gems < cost) return;
    playTaskCompleteTone(1.4, soundEnabled);
    triggerHaptic([30, 20, 50], hapticsEnabled);
    action();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4 select-none">
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-theme p-6 shadow-2xl animate-in fade-in slide-in-from-bottom duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-theme">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <GemIcon size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-main">Gem Power Vault</h2>
              <p className="text-[11px] text-sub">Activate operational tactical perks</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-card-subtle flex items-center justify-center text-sub hover:text-main"
            aria-label="Close"
          >
            <CrossIcon size={16} />
          </button>
        </div>

        {/* Current Balance */}
        <div className="my-4 p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-between">
          <span className="text-xs text-sub font-mono font-medium">Your Prismatic Gems:</span>
          <div className="flex items-center gap-1.5 font-mono text-base font-bold text-sky-400">
            <GemIcon size={16} />
            <span>{profile.gems} Gems</span>
          </div>
        </div>

        {/* Perk Items List */}
        <div className="space-y-3">
          {/* Streak Shield */}
          <div className="p-3.5 rounded-2xl border border-theme bg-card-subtle flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-400 shrink-0">
                <ShieldIcon size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-main">Streak Shield</h4>
                  {profile.boosters.hasStreakShield && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-sky-500/20 text-sky-300 font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-sub mt-0.5">
                  Protects your streak against 1 missed day
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={profile.gems < 5 || profile.boosters.hasStreakShield}
              onClick={() => handlePurchase(5, onActivateStreakShield)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold shrink-0 transition-all ${
                profile.boosters.hasStreakShield
                  ? 'bg-sky-500/20 text-sky-400 cursor-default'
                  : profile.gems >= 5
                  ? 'bg-sky-500 hover:bg-sky-400 text-black shadow-md'
                  : 'bg-card-subtle border border-theme text-dim cursor-not-allowed'
              }`}
            >
              {profile.boosters.hasStreakShield ? 'Armed' : '5 Gems'}
            </button>
          </div>

          {/* XP Catalyst */}
          <div className="p-3.5 rounded-2xl border border-theme bg-card-subtle flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center text-violet-400 shrink-0">
                <ZapIcon size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-main">2x XP Catalyst</h4>
                  {profile.boosters.xpBoostSessionsLeft > 0 && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-violet-500/20 text-violet-300 font-bold">
                      {profile.boosters.xpBoostSessionsLeft} QUESTS LEFT
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-sub mt-0.5">
                  Doubles XP on next 2 verified cleaning quests
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={profile.gems < 4}
              onClick={() => handlePurchase(4, onActivateXpBoost)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold shrink-0 transition-all ${
                profile.gems >= 4
                  ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-md'
                  : 'bg-card-subtle border border-theme text-dim cursor-not-allowed'
              }`}
            >
              4 Gems
            </button>
          </div>

          {/* Transmute Coins */}
          <div className="p-3.5 rounded-2xl border border-theme bg-card-subtle flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0">
                <CoinIcon size={20} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-main">Coin Transmuter</h4>
                <p className="text-[11px] text-sub mt-0.5">
                  Instantly convert 2 Gems into 150 Armory Coins
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={profile.gems < 2}
              onClick={() => handlePurchase(2, onTransmuteCoins)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold shrink-0 transition-all ${
                profile.gems >= 2
                  ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-md'
                  : 'bg-card-subtle border border-theme text-dim cursor-not-allowed'
              }`}
            >
              2 Gems
            </button>
          </div>

          {/* Clutter Radar Scanner */}
          <div className="p-3.5 rounded-2xl border border-theme bg-card-subtle flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                <SparklesIcon size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-main">Clutter Radar Boost</h4>
                  {profile.boosters.hasRadarActive && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 font-bold">
                      READY
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-sub mt-0.5">
                  Guarantees a rare loot drop on next verified quest
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={profile.gems < 3 || profile.boosters.hasRadarActive}
              onClick={() => handlePurchase(3, onActivateRadar)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold shrink-0 transition-all ${
                profile.boosters.hasRadarActive
                  ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                  : profile.gems >= 3
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md'
                  : 'bg-card-subtle border border-theme text-dim cursor-not-allowed'
              }`}
            >
              {profile.boosters.hasRadarActive ? 'Armed' : '3 Gems'}
            </button>
          </div>

          {/* Phoenix Streak Elixir */}
          {onReviveStreak && (
            <div className="p-3.5 rounded-2xl border border-theme bg-card-subtle flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 shrink-0">
                  <FlameIcon size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-main">Phoenix Streak Elixir</h4>
                  <p className="text-[11px] text-sub mt-0.5">
                    Infuses +3 bonus days directly into your active cleaning streak
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={profile.gems < 6}
                onClick={() => handlePurchase(6, onReviveStreak)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold shrink-0 transition-all ${
                  profile.gems >= 6
                    ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-md cursor-pointer'
                    : 'bg-card-subtle border border-theme text-dim cursor-not-allowed'
                }`}
              >
                6 Gems
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
