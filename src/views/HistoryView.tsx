import React from 'react';
import { SessionRecord } from '../types';
import {
  ClockIcon,
  FlameIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ZapIcon,
} from '../components/icons';
import { triggerHaptic } from '../utils/audio';

interface HistoryViewProps {
  history: SessionRecord[];
  totalMessCleared: number;
  onBack: () => void;
  hapticsEnabled: boolean;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  totalMessCleared,
  onBack,
  hapticsEnabled,
}) => {
  return (
    <div className="px-4 sm:px-8 py-6 max-w-5xl mx-auto space-y-6 pb-28 select-none transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            triggerHaptic(10, hapticsEnabled);
            onBack();
          }}
          className="w-9 h-9 rounded-xl bg-card border border-theme flex items-center justify-center text-sub hover:text-main"
          aria-label="Back"
        >
          <ArrowLeftIcon size={16} />
        </button>
        <div>
          <p className="text-[10px] font-mono tracking-widest uppercase text-account font-bold">
            Archival Record
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-main font-normal">Session Ledger</h1>
        </div>
      </div>

      {/* Two Summary Stat Tiles */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-theme shadow-sm">
          <p className="text-[10px] font-mono text-sub uppercase">Total Mess Cleared</p>
          <p className="text-3xl font-mono font-bold text-emerald-500 mt-1">
            +{totalMessCleared}%
          </p>
          <p className="text-xs text-dim mt-0.5">Cumulative clutter reduction</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-theme shadow-sm">
          <p className="text-[10px] font-mono text-sub uppercase">Verified Clears</p>
          <p className="text-3xl font-mono font-bold text-main mt-1">
            {history.length}
          </p>
          <p className="text-xs text-dim mt-0.5">Proof-certified logs</p>
        </div>
      </div>

      {/* List of Sessions (Responsive Grid on PC) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.length === 0 ? (
          <div className="col-span-2 p-8 rounded-2xl bg-card border border-theme text-center text-xs text-dim font-mono">
            No session history recorded yet. Complete your first cleaning quest to view proof cards here.
          </div>
        ) : (
          history.map((session) => (
            <div
              key={session.id}
              className="p-5 rounded-2xl bg-card border border-theme space-y-3 shadow-sm"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif text-lg font-bold ${
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
                    <h4 className="text-xs font-bold text-main capitalize">
                      {session.roomType.replace('_', ' ')}
                    </h4>
                    <p className="text-[10px] font-mono text-dim">
                      {new Date(session.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-emerald-500">
                    +{session.improvement}%
                  </span>
                  <p className="font-mono text-[10px] text-dim">
                    {Math.round(session.durationSeconds / 60)} min • +{session.xpEarned} XP
                  </p>
                </div>
              </div>

              {/* Side-by-side Thumbnails */}
              {session.beforeImage && session.afterImage && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-card-subtle border border-theme">
                    <img
                      src={session.beforeImage}
                      alt="Before"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[8px] font-mono text-white">
                      BEFORE {session.messBefore}%
                    </div>
                  </div>

                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-card-subtle border border-emerald-500/30">
                    <img
                      src={session.afterImage}
                      alt="After"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-emerald-950/80 text-[8px] font-mono text-emerald-300">
                      AFTER {session.messAfter}%
                    </div>
                  </div>
                </div>
              )}

              {/* Commentary */}
              {session.commentary && (
                <p className="text-[11px] text-sub italic leading-relaxed">
                  "{session.commentary}"
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
