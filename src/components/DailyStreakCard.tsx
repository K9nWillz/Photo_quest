import React from 'react';
import { FlameIcon, CheckIcon, ShieldIcon, GemIcon } from './icons';
import { triggerHaptic, playTaskCompleteTone } from '../utils/audio';

interface DailyStreakCardProps {
  streak: number;
  lastPlayedDay: string;
  checkedInDays: string[];
  hasStreakShield: boolean;
  onCheckInToday: () => void;
  hapticsEnabled: boolean;
  soundEnabled: boolean;
}

export const DailyStreakCard: React.FC<DailyStreakCardProps> = ({
  streak,
  lastPlayedDay,
  checkedInDays = [],
  hasStreakShield = false,
  onCheckInToday,
  hapticsEnabled,
  soundEnabled,
}) => {
  const todayDate = new Date();
  const todayIso = todayDate.toISOString().split('T')[0];
  const isTodayCheckedIn = lastPlayedDay === todayIso || checkedInDays.includes(todayIso);

  // Calculate current Monday of the week
  const dayOfWeek = todayDate.getDay(); // 0 is Sunday, 1 is Monday
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const mondayDate = new Date(todayDate);
  mondayDate.setDate(todayDate.getDate() + mondayOffset);

  const daysInfo = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(mondayDate);
    d.setDate(mondayDate.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    const isToday = iso === todayIso;
    const isPast = d < todayDate && !isToday;
    const isFuture = d > todayDate && !isToday;
    const isChecked = checkedInDays.includes(iso) || (isToday && isTodayCheckedIn);

    return {
      dayName: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i],
      fullDayName: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      dateNumber: d.getDate(),
      iso,
      isToday,
      isPast,
      isFuture,
      isChecked,
    };
  });

  const handleManualCheckIn = () => {
    if (isTodayCheckedIn) return;
    playTaskCompleteTone(1.2, soundEnabled);
    triggerHaptic([20, 30, 40], hapticsEnabled);
    onCheckInToday();
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-card border border-theme shadow-sm select-none transition-all">
      {/* Header with Flame, Count and Today Status */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
            <FlameIcon size={20} className={streak > 0 ? 'animate-pulse' : ''} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-semibold text-main uppercase tracking-wider font-mono">
                Daily Cleaning Streak
              </h3>
              {hasStreakShield && (
                <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-sky-500/15 text-sky-500 border border-sky-500/30 text-[9px] font-mono font-bold">
                  <ShieldIcon size={10} /> SHIELD
                </span>
              )}
            </div>
            <p className="text-xs text-sub mt-0.5">
              {isTodayCheckedIn ? 'Checked in today. Streak intact.' : 'Pending check-in for today.'}
            </p>
          </div>
        </div>

        {/* Streak number */}
        <div className="text-right">
          <span className="font-mono text-xl sm:text-2xl font-bold text-amber-500">
            {streak}
          </span>
          <span className="text-xs font-mono text-sub ml-1">{streak === 1 ? 'day' : 'days'}</span>
        </div>
      </div>

      {/* 7-Days Interactive Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 my-3">
        {daysInfo.map((d) => {
          return (
            <div
              key={d.iso}
              className={`relative flex flex-col items-center justify-between py-2 px-1 rounded-xl transition-all ${
                d.isToday
                  ? d.isChecked
                    ? 'bg-amber-500/15 border-2 border-amber-500 shadow-sm'
                    : 'bg-account border-2 border-dashed border-[#84cc16] animate-pulse cursor-pointer'
                  : d.isChecked
                  ? 'bg-amber-500/10 border border-amber-500/30 text-amber-500'
                  : d.isPast
                  ? 'bg-card-subtle border border-theme opacity-50'
                  : 'bg-card-subtle border border-dashed border-theme opacity-70'
              }`}
              onClick={d.isToday && !d.isChecked ? handleManualCheckIn : undefined}
            >
              {/* Day Label */}
              <span
                className={`text-[10px] font-mono font-semibold ${
                  d.isToday ? 'text-account font-bold' : 'text-sub'
                }`}
              >
                {d.dayName}
              </span>

              {/* Status Icon */}
              <div className="my-1.5 flex items-center justify-center h-6">
                {d.isChecked ? (
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">
                    <CheckIcon size={12} strokeWidth={2.5} />
                  </div>
                ) : d.isToday ? (
                  <div className="w-5 h-5 rounded-full border-2 border-[#84cc16] flex items-center justify-center text-[#84cc16]">
                    <span className="w-2 h-2 rounded-full bg-[#84cc16] animate-ping" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-theme flex items-center justify-center text-[9px] font-mono text-dim">
                    {d.dateNumber}
                  </div>
                )}
              </div>

              {/* Today Pill or Date Number */}
              <span
                className={`text-[9px] font-mono tracking-tighter ${
                  d.isToday
                    ? 'font-bold text-account'
                    : d.isChecked
                    ? 'text-amber-500 font-medium'
                    : 'text-dim'
                }`}
              >
                {d.isToday ? 'TODAY' : `${d.dateNumber}`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom Action / Incentive */}
      <div className="pt-2 border-t border-theme flex items-center justify-between text-[11px] font-mono">
        {!isTodayCheckedIn ? (
          <button
            type="button"
            onClick={handleManualCheckIn}
            className="w-full py-2 px-3 rounded-xl bg-account border border-account text-account font-semibold flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-98 transition-all"
          >
            <CheckIcon size={14} />
            <span>Log Today's Practice (+10 XP)</span>
          </button>
        ) : (
          <div className="w-full flex items-center justify-between text-sub">
            <span className="flex items-center gap-1 text-[#84cc16] font-semibold">
              <CheckIcon size={13} /> Checked In Today
            </span>
            <span className="text-dim">Day 7 Perk: +100 Coins & +3 Gems</span>
          </div>
        )}
      </div>
    </div>
  );
};
