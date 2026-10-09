import React, { useEffect } from 'react';
import { GradeType, EquipmentId } from '../types';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import {
  FlameIcon,
  CoinIcon,
  GemIcon,
  ZapIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  PackageIcon,
} from '../components/icons';
import { EQUIPMENT_ITEMS } from '../components/avatars';
import { fireRestrainedConfetti } from '../utils/confetti';
import { playGradeRevealTone, triggerHaptic } from '../utils/audio';

interface ResultPassViewProps {
  grade: GradeType;
  beforeImage: string;
  afterImage: string;
  messBefore: number;
  messAfter: number;
  improvement: number;
  durationSeconds: number;
  xpEarned: number;
  coinsEarned: number;
  gemsEarned: number;
  lootDrop?: EquipmentId | null;
  isFallback: boolean;
  fallbackError?: string;
  commentary: string;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onDone: () => void;
  onOpenLocker: () => void;
}

export const ResultPassView: React.FC<ResultPassViewProps> = ({
  grade,
  beforeImage,
  afterImage,
  messBefore,
  messAfter,
  improvement,
  durationSeconds,
  xpEarned,
  coinsEarned,
  gemsEarned,
  lootDrop,
  isFallback,
  fallbackError,
  commentary,
  soundEnabled,
  hapticsEnabled,
  onDone,
  onOpenLocker,
}) => {
  useEffect(() => {
    fireRestrainedConfetti();
    playGradeRevealTone(grade, soundEnabled);
    triggerHaptic([40, 30, 60], hapticsEnabled);
  }, [grade, soundEnabled, hapticsEnabled]);

  const droppedItem = lootDrop && lootDrop !== 'none'
    ? EQUIPMENT_ITEMS.find((e) => e.id === lootDrop)
    : null;

  return (
    <div className="px-4 sm:px-8 py-6 max-w-4xl mx-auto space-y-6 pb-28 select-none transition-colors">
      {/* Header & Grade Pop */}
      <div className="text-center pt-2">
        <p className="text-[11px] font-mono tracking-widest uppercase text-emerald-500 font-bold mb-1">
          Verification Passed
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl text-main font-normal">Clean Certified</h1>

        {/* Grade Letter with spring scale */}
        <div className="flex justify-center my-5">
          <div
            className={`w-28 h-28 rounded-3xl flex items-center justify-center font-serif text-7xl font-bold shadow-2xl transition-transform duration-500 hover:scale-105 ${
              grade === 'S'
                ? 'bg-amber-500/15 text-amber-500 border-2 border-amber-500 shadow-amber-500/20'
                : grade === 'A'
                ? 'bg-violet-500/15 text-violet-500 border-2 border-violet-500 shadow-violet-500/20'
                : 'bg-emerald-500/15 text-emerald-500 border-2 border-emerald-500 shadow-emerald-500/20'
            }`}
          >
            {grade}
          </div>
        </div>
      </div>

      {/* Before / After Interactive Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1 text-[11px] font-mono text-sub">
          <span className="font-bold">VERIFIED BEFORE / AFTER</span>
          <span>DRAG SLIDER TO INSPECT</span>
        </div>
        <BeforeAfterSlider beforeImage={beforeImage} afterImage={afterImage} />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-theme shadow-sm">
          <p className="text-[10px] font-mono text-sub uppercase">Initial Clutter</p>
          <p className="text-2xl font-mono font-bold text-main mt-1">{messBefore}%</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-theme shadow-sm">
          <p className="text-[10px] font-mono text-sub uppercase">Verified Final</p>
          <p className="text-2xl font-mono font-bold text-emerald-500 mt-1">{messAfter}%</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-theme shadow-sm">
          <p className="text-[10px] font-mono text-sub uppercase">Improvement</p>
          <p className="text-2xl font-mono font-bold text-emerald-500 mt-1">+{improvement}%</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-theme shadow-sm">
          <p className="text-[10px] font-mono text-sub uppercase">Duration</p>
          <p className="text-2xl font-mono font-bold text-main mt-1">
            {Math.round(durationSeconds / 60)}m {durationSeconds % 60}s
          </p>
        </div>
      </div>

      {/* Yield Rewards */}
      <div className="p-5 rounded-2xl bg-card border border-theme shadow-sm space-y-3">
        <p className="text-xs font-mono uppercase tracking-wider text-sub font-bold">
          Verified Practice Yield
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-center">
            <span className="text-[10px] font-mono text-violet-500 font-bold">XP REWARD</span>
            <p className="text-xl font-mono font-bold text-main mt-0.5">+{xpEarned}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="text-[10px] font-mono text-amber-500 font-bold">ARMORY COINS</span>
            <p className="text-xl font-mono font-bold text-amber-500 mt-0.5">+{coinsEarned}</p>
          </div>
          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-center">
            <span className="text-[10px] font-mono text-sky-500 font-bold">PRISM GEMS</span>
            <p className="text-xl font-mono font-bold text-sky-500 mt-0.5">+{gemsEarned}</p>
          </div>
        </div>
      </div>

      {/* Loot Drop Card */}
      {droppedItem && (
        <div className="p-5 rounded-2xl bg-card border-2 border-amber-500 flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
              <PackageIcon size={26} />
            </div>
            <div>
              <p className="text-[10px] font-mono text-amber-500 uppercase tracking-wider font-bold">
                Rare Cosmetic Loot
              </p>
              <h4 className="text-sm font-bold text-main mt-0.5">{droppedItem.name}</h4>
              <p className="text-xs text-sub">{droppedItem.description}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenLocker}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold shrink-0 shadow"
          >
            Locker
          </button>
        </div>
      )}

      {/* Commentary */}
      {commentary && (
        <div className="p-5 rounded-2xl bg-card border border-theme">
          <p className="text-[10px] font-mono text-dim uppercase tracking-wider mb-1">
            Verification Auditor Assessment
          </p>
          <p className="text-xs sm:text-sm text-sub italic leading-relaxed">"{commentary}"</p>
        </div>
      )}

      {/* Fallback Warning Card */}
      {isFallback && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-500">
          <AlertTriangleIcon size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Edge Density Matrix Mode</p>
            <p className="text-[11px] text-sub mt-0.5">
              {fallbackError || 'Luminance gradient difference evaluated this session.'}
            </p>
          </div>
        </div>
      )}

      {/* Continue CTA */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic(20, hapticsEnabled);
          onDone();
        }}
        className="w-full py-4 px-6 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xl shadow-violet-600/25 active:scale-98 transition-all"
      >
        <span>Complete Session & Save Proof</span>
        <ArrowRightIcon size={18} />
      </button>
    </div>
  );
};
