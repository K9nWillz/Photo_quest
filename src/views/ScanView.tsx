import React, { useState, useEffect } from 'react';
import { RefreshCwIcon } from '../components/icons';

interface ScanViewProps {
  imagePreviewUrl: string;
  isFallback: boolean;
}

const STAGES = [
  'Uploading image to Gemini…',
  'Identifying clutter categories…',
  'Mapping bounding boxes…',
  'Estimating effort per task…',
  'Building your quest…',
];

export const ScanView: React.FC<ScanViewProps> = ({ imagePreviewUrl, isFallback }) => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between px-4 sm:px-8 py-8 max-w-xl mx-auto select-none transition-colors">
      {/* Top Header */}
      <div className="text-center pt-2">
        <p className="text-[11px] font-mono tracking-widest uppercase text-account font-bold mb-1">
          Vision Processing
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-main font-normal">Analyzing Space</h2>
      </div>

      {/* Photo with Vertical Scanline */}
      <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-black border border-theme shadow-2xl my-6">
        <img
          src={imagePreviewUrl}
          alt="Room scanning"
          className="w-full h-full object-cover filter brightness-95"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* 3px CSS Animated Scanline Bar */}
        <div className="animate-scanline" />

        {/* Corner HUD framing */}
        <div className="absolute inset-4 border border-white/20 rounded-2xl pointer-events-none flex flex-col justify-between p-3.5">
          <div className="flex justify-between items-center text-[10px] font-mono text-emerald-400 font-bold">
            <span>ISO 800</span>
            <span>GRID ACTIVE</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-300 font-bold">
            <span>F/2.8</span>
            <span>{isFallback ? 'EDGE_MATRIX' : 'GEMINI_AI'}</span>
          </div>
        </div>
      </div>

      {/* Bottom Cycling Status Indicator */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-theme flex items-center gap-3.5 shadow-md">
        <RefreshCwIcon size={22} className="animate-spin text-emerald-500 shrink-0" />
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-mono text-main font-semibold tracking-tight">
            {STAGES[stageIndex]}
          </p>
          <div className="w-full h-1.5 rounded-full bg-card-subtle border border-theme overflow-hidden mt-2">
            <div
              className="h-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
