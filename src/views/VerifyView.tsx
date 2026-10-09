import React, { useState, useEffect } from 'react';
import { RefreshCwIcon } from '../components/icons';

interface VerifyViewProps {
  beforeImage: string;
  afterImage: string;
}

const VERIFY_STAGES = [
  'Comparing before and after angles…',
  'Scoring volumetric improvement…',
  'Auditing remaining clutter clusters…',
  'Finalizing performance grade…',
];

export const VerifyView: React.FC<VerifyViewProps> = ({ beforeImage, afterImage }) => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStageIndex((prev) => (prev < VERIFY_STAGES.length - 1 ? prev + 1 : prev));
    }, 1300);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between px-4 sm:px-8 py-8 max-w-xl mx-auto select-none transition-colors">
      {/* Header */}
      <div className="text-center pt-2">
        <p className="text-[11px] font-mono tracking-widest uppercase text-emerald-500 font-bold mb-1">
          Proof Verification
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-main font-normal">
          Comparing Before & After
        </h2>
      </div>

      {/* Dual Photo Presentation with Scanlines */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 my-6">
        {/* Before Photo */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black border border-theme shadow-lg">
          <img src={beforeImage} alt="Before" className="w-full h-full object-cover filter brightness-90" />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-[9px] font-mono text-white font-bold">
            BEFORE
          </div>
          <div className="animate-scanline" />
        </div>

        {/* After Photo */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black border-2 border-emerald-500 shadow-lg">
          <img src={afterImage} alt="After" className="w-full h-full object-cover filter brightness-95" />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-950/80 backdrop-blur-md text-[9px] font-mono text-emerald-400 border border-emerald-500/40 font-bold">
            AFTER
          </div>
          <div className="animate-scanline" />
        </div>
      </div>

      {/* Status Cycling Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-theme flex items-center gap-3.5 shadow-md">
        <RefreshCwIcon size={22} className="animate-spin text-emerald-500 shrink-0" />
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-mono text-main font-semibold tracking-tight">
            {VERIFY_STAGES[stageIndex]}
          </p>
          <div className="w-full h-1.5 rounded-full bg-card-subtle border border-theme overflow-hidden mt-2">
            <div
              className="h-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${((stageIndex + 1) / VERIFY_STAGES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
