import React from 'react';
import { CameraIcon, ListChecksIcon, CheckCircleIcon, ArrowRightIcon } from '../components/icons';
import { triggerHaptic } from '../utils/audio';

interface WelcomeViewProps {
  onStart: () => void;
  hapticsEnabled: boolean;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart, hapticsEnabled }) => {
  return (
    <div className="min-h-[100dvh] flex flex-col justify-between px-6 sm:px-10 py-12 max-w-xl mx-auto select-none transition-colors">
      {/* Top Brand */}
      <div className="pt-4">
        <p className="text-[11px] font-mono tracking-widest uppercase text-account font-bold mb-2">
          Methodical Practice
        </p>
        <h1 className="font-serif text-5xl sm:text-7xl text-main font-normal tracking-tight leading-[0.95]">
          Cleaning,
          <br />
          <span className="italic text-sub">measured.</span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-sub leading-relaxed max-w-[36ch]">
          Household tidying treated as measurable discipline rather than gamified chore theater. Proof required before session counts.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="my-8 space-y-3.5">
        <div className="p-5 rounded-2xl bg-card border border-theme flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center text-violet-500 shrink-0">
            <CameraIcon size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-account font-bold">01</span>
              <h3 className="text-sm font-bold text-main">Photograph the Mess</h3>
            </div>
            <p className="text-xs text-sub mt-1 leading-relaxed">
              Gemini vision detects distinct clutter clusters, calculates real bounding boxes, and estimates physical minutes.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-theme flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 shrink-0">
            <ListChecksIcon size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-account font-bold">02</span>
              <h3 className="text-sm font-bold text-main">Execute Physical Tasks</h3>
            </div>
            <p className="text-xs text-sub mt-1 leading-relaxed">
              Clear items sequentially in real life. Chain rapid completions within thirty seconds for compounding combo multipliers.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-theme flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircleIcon size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-account font-bold">03</span>
              <h3 className="text-sm font-bold text-main">Verify the Result</h3>
            </div>
            <p className="text-xs text-sub mt-1 leading-relaxed">
              Photograph the identical angle. Only rooms exhibiting an eight percent or greater reduction pass AI verification.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="pb-4">
        <button
          type="button"
          onClick={() => {
            triggerHaptic(20, hapticsEnabled);
            onStart();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-violet-600/25 active:scale-98 transition-all"
        >
          <span>Begin First Practice</span>
          <ArrowRightIcon size={18} />
        </button>
      </div>
    </div>
  );
};
