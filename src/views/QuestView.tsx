import React, { useState, useEffect } from 'react';
import { MonsterItem, RoomType } from '../types';
import { MonsterPin, MonsterIcon } from '../components/monsters';
import {
  ClockIcon,
  ZapIcon,
  CheckCircleIcon,
  CameraIcon,
  ShieldIcon,
  FlameIcon,
} from '../components/icons';
import { playTaskCompleteTone, triggerHaptic } from '../utils/audio';

interface QuestViewProps {
  roomImage: string;
  roomType: RoomType;
  monsters: MonsterItem[];
  commentary: string;
  onTaskToggle: (monsterId: string, earnedXp: number) => void;
  onProceedToVerify: () => void;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  totalDurationSeconds: number;
  xpMultiplierBonus?: number;
}

const DRY_BOSS_QUOTES = [
  'Entropy remains undefeated unless physical action is taken.',
  'Objects in space tend to expand to fill available flat surfaces.',
  'A room without order is merely storage with a mattress.',
  'Order is not an aesthetic; it is the conservation of mental bandwidth.',
  'The clutter has no feelings. Put it where it belongs.',
];

export const QuestView: React.FC<QuestViewProps> = ({
  roomImage,
  roomType,
  monsters,
  commentary,
  onTaskToggle,
  onProceedToVerify,
  soundEnabled,
  hapticsEnabled,
  totalDurationSeconds,
  xpMultiplierBonus = 1,
}) => {
  const [combo, setCombo] = useState(1);
  const [comboTimeLeft, setComboTimeLeft] = useState(0);
  const [activeToast, setActiveToast] = useState<{ text: string; xp: number } | null>(null);

  useEffect(() => {
    if (comboTimeLeft <= 0) {
      setCombo(1);
      return;
    }

    const timer = setInterval(() => {
      setComboTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [comboTimeLeft]);

  const totalTasks = monsters.length;
  const completedTasks = monsters.filter((m) => m.completed).length;
  const roomHealthPercent = totalTasks > 0 ? Math.round(((totalTasks - completedTasks) / totalTasks) * 100) : 0;
  const allCompleted = completedTasks === totalTasks && totalTasks > 0;

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isTimerWarning = totalDurationSeconds > 15 * 60;
  const isTimerDanger = totalDurationSeconds > 30 * 60;

  const handleTaskClick = (monster: MonsterItem) => {
    if (monster.completed) return;

    const baseMultiplier = 1 + 0.5 * (combo - 1);
    const effectiveMultiplier = baseMultiplier * xpMultiplierBonus;
    const xpEarned = Math.round(monster.xp * effectiveMultiplier);

    const nextCombo = Math.min(3, combo + 1);
    setCombo(nextCombo);
    setComboTimeLeft(30);

    playTaskCompleteTone(effectiveMultiplier, soundEnabled);
    triggerHaptic([30, 20, 30], hapticsEnabled);

    setActiveToast({
      text: `${monster.name} cleared!`,
      xp: xpEarned,
    });
    setTimeout(() => setActiveToast(null), 2500);

    onTaskToggle(monster.id, xpEarned);
  };

  return (
    <div className="px-4 sm:px-8 py-6 max-w-5xl mx-auto space-y-6 pb-28 select-none transition-colors">
      {/* Session Timer & Status Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-main font-bold capitalize">
            {roomType.replace('_', ' ')} Quest Zone
          </span>
          {xpMultiplierBonus > 1 && (
            <span className="px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-400 font-mono text-[10px] font-bold">
              {xpMultiplierBonus}x XP Boost Active
            </span>
          )}
        </div>

        {/* Stopwatch */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold ${
            isTimerDanger
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-500 animate-pulse'
              : isTimerWarning
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
              : 'bg-card border-theme text-main'
          }`}
        >
          <ClockIcon size={14} />
          <span>{formatTimer(totalDurationSeconds)}</span>
        </div>
      </div>

      {/* Responsive Grid for PC & Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left: Photo with Pins & Boss Health */}
        <div className="space-y-4">
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-black border border-theme shadow-xl">
            <img src={roomImage} alt="Room quest zone" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/25 pointer-events-none" />

            {/* Monster Pins */}
            {monsters.map((monster) => {
              const yCenter = (monster.box[0] + monster.box[2]) / 20;
              const xCenter = (monster.box[1] + monster.box[3]) / 20;
              const clampedY = Math.min(Math.max(yCenter, 12), 88);
              const clampedX = Math.min(Math.max(xCenter, 8), 92);

              return (
                <div
                  key={monster.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ left: `${clampedX}%`, top: `${clampedY}%` }}
                >
                  <MonsterPin
                    shape={monster.shape}
                    color={monster.color}
                    name={monster.name}
                    minutes={monster.minutes}
                    completed={monster.completed}
                    onClick={() => handleTaskClick(monster)}
                  />
                </div>
              );
            })}

            {/* Active Toast Overlay */}
            {activeToast && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-violet-950/95 border border-violet-500/50 text-white text-xs font-mono font-medium shadow-2xl flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200 z-30">
                <ZapIcon size={14} className="text-amber-400" />
                <span>{activeToast.text}</span>
                <span className="text-amber-300 font-bold">+{activeToast.xp} XP</span>
              </div>
            )}
          </div>

          {/* Boss Card: The Room Health */}
          <div className="p-5 rounded-2xl bg-card border border-theme space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldIcon size={18} className="text-rose-500" />
                <p className="text-xs font-bold text-main uppercase tracking-wider font-mono">
                  Room Boss Health
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-rose-500">
                {roomHealthPercent}% HP ({completedTasks}/{totalTasks} cleared)
              </span>
            </div>

            {/* Boss HP Bar */}
            <div className="w-full h-3 rounded-full bg-card-subtle border border-theme overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
                style={{ width: `${roomHealthPercent}%` }}
              />
            </div>

            <p className="text-xs text-sub italic leading-relaxed">
              "{commentary || DRY_BOSS_QUOTES[Math.floor(Math.random() * DRY_BOSS_QUOTES.length)]}"
            </p>
          </div>

          {/* Combo Multiplier Tracker */}
          {comboTimeLeft > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <FlameIcon size={18} className="text-amber-500 animate-bounce" />
                <span className="text-xs font-mono text-amber-500 font-bold">
                  Combo Multiplier: {(1 + 0.5 * (combo - 1) * xpMultiplierBonus).toFixed(1)}x
                </span>
              </div>
              <span className="text-xs font-mono text-amber-500 font-bold">{comboTimeLeft}s</span>
            </div>
          )}
        </div>

        {/* Right: Task Checklist & Verification Gate */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-sub font-bold">
              Clutter Targets ({completedTasks}/{totalTasks})
            </h3>
            <span className="text-xs font-mono text-dim">Tap item to clear</span>
          </div>

          <div className="space-y-2.5">
            {monsters.map((monster) => {
              return (
                <div
                  key={monster.id}
                  onClick={() => handleTaskClick(monster)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    monster.completed
                      ? 'bg-card-subtle border-theme opacity-50'
                      : 'bg-card hover:bg-card-elevated border-theme shadow-sm active:scale-[0.99]'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-theme"
                      style={{ backgroundColor: `${monster.color}15` }}
                    >
                      <MonsterIcon shape={monster.shape} color={monster.color} size={30} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4
                          className={`text-sm font-bold truncate ${
                            monster.completed ? 'line-through text-dim' : 'text-main'
                          }`}
                        >
                          {monster.name}
                        </h4>
                        <span className="font-mono text-xs font-bold text-amber-500 shrink-0">
                          +{Math.round(monster.xp * xpMultiplierBonus)} XP
                        </span>
                      </div>

                      <p className="text-xs text-sub mt-0.5 leading-snug">{monster.task}</p>

                      <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-dim">
                        <span className="text-sub font-semibold">{monster.label}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <ClockIcon size={11} />
                          ~{monster.minutes} min
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 pt-0.5">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                          monster.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                            : 'border-theme'
                        }`}
                      >
                        {monster.completed && <CheckCircleIcon size={16} />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gold Verification Card (Revealed when all tasks cleared) */}
          {allCompleted && (
            <div className="p-6 rounded-3xl bg-card border-2 border-amber-500 shadow-2xl space-y-3.5 animate-in fade-in slide-in-from-bottom duration-300">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center">
                  <CheckCircleIcon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-main">All Clutter Targets Cleared</h3>
                  <p className="text-xs text-sub">Proof-of-clean verification requires an 8% minimum improvement.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(25, hapticsEnabled);
                  onProceedToVerify();
                }}
                className="w-full py-4 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-98 transition-all"
              >
                <CameraIcon size={20} />
                <span>Photograph Result (Verify Angle)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
