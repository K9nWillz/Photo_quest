import React, { useEffect } from 'react';
import { AlertCircleIcon, CameraIcon, ArrowLeftIcon } from '../components/icons';
import { playGradeRevealTone, triggerHaptic } from '../utils/audio';

interface ResultFailViewProps {
  beforeImage: string;
  afterImage: string;
  messBefore: number;
  messAfter: number;
  improvement: number;
  commentary: string;
  remaining?: string[];
  onRetryPhoto: () => void;
  onAbandon: () => void;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

export const ResultFailView: React.FC<ResultFailViewProps> = ({
  beforeImage,
  afterImage,
  messBefore,
  messAfter,
  improvement,
  commentary,
  remaining = [],
  onRetryPhoto,
  onAbandon,
  soundEnabled,
  hapticsEnabled,
}) => {
  useEffect(() => {
    playGradeRevealTone('FAIL', soundEnabled);
    triggerHaptic([50, 40, 50], hapticsEnabled);
  }, [soundEnabled, hapticsEnabled]);

  return (
    <div className="px-4 sm:px-8 py-8 max-w-2xl mx-auto space-y-6 pb-28 select-none transition-colors">
      {/* Danger Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-rose-500/10 border-2 border-rose-500 text-center space-y-3 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500 mx-auto">
          <AlertCircleIcon size={32} />
        </div>

        <div>
          <p className="text-[11px] font-mono tracking-widest uppercase text-rose-500 font-bold">
            Threshold Unmet
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-main font-normal mt-0.5">
            Improvement Not Detected
          </h1>
        </div>

        <p className="text-xs sm:text-sm text-sub leading-relaxed max-w-md mx-auto">
          Photo Quest requires at least an 8% measurable reduction in clutter. Calculated improvement was{' '}
          <strong className="font-mono text-rose-500 font-bold">{improvement > 0 ? `+${improvement}%` : `${improvement}%`}</strong>.
        </p>
      </div>

      {/* Before / After Thumbnail Comparison */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-theme shadow-md">
          <img src={beforeImage} alt="Before" className="w-full h-full object-cover" />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[9px] font-mono text-white font-bold">
            BEFORE ({messBefore}%)
          </div>
        </div>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border-2 border-rose-500 shadow-md">
          <img src={afterImage} alt="After" className="w-full h-full object-cover" />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-950/80 text-[9px] font-mono text-rose-300 border border-rose-500/30 font-bold">
            AFTER ({messAfter}%)
          </div>
        </div>
      </div>

      {/* Commentary */}
      {commentary && (
        <div className="p-5 rounded-2xl bg-card border border-theme space-y-1 shadow-sm">
          <p className="text-[10px] font-mono text-dim uppercase tracking-wider">
            Auditor Assessment
          </p>
          <p className="text-xs sm:text-sm text-sub italic leading-relaxed">"{commentary}"</p>
        </div>
      )}

      {/* Remaining Clutter Detected List */}
      {remaining.length > 0 && (
        <div className="p-5 rounded-2xl bg-card border border-theme space-y-2 shadow-sm">
          <p className="text-xs font-mono text-rose-500 uppercase tracking-wider font-bold">
            Unaddressed Clutter Still Visible
          </p>
          <ul className="space-y-1.5 text-xs text-sub">
            {remaining.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 font-mono font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTAs */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={() => {
            triggerHaptic(20, hapticsEnabled);
            onRetryPhoto();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-600/25 active:scale-98 transition-all"
        >
          <CameraIcon size={20} />
          <span>Photograph Again (Retry Verification)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic(10, hapticsEnabled);
            onAbandon();
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-card border border-theme hover:bg-card-elevated text-sub text-xs font-mono flex items-center justify-center gap-1.5 active:scale-98 transition-all"
        >
          <ArrowLeftIcon size={14} />
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );
};
