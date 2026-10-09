import React from 'react';
import { FlameIcon, CheckIcon, ShieldIcon, GemIcon, SparklesIcon, CalendarIcon } from './icons';
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
      dayName: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      shortDay: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i],
      dateNumber: d.getDate(),
      iso,
      isToday,
      isPast,
      isFuture,
      isChecked,
    };
  });

  const checkedThisWeekCount = daysInfo.filter((d) => d.isChecked).length;
  const weeklyProgressPercent = Math.min(100, Math.round((checkedThisWeekCount / 7) * 100));

  const handleManualCheckIn = () => {
    if (isTodayCheckedIn) return;
    playTaskCompleteTone(1.2, soundEnabled);
    triggerHaptic([20, 30, 40], hapticsEnabled);
    onCheckInToday();
  };

  return (
    <div className="p-4 sm:p-6 rounded-3xl bg-card border border-theme shadow-md select-none transition-all">
      {/* Top Header: Streak counter, Shield Badge, and Status */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                streak > 0
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40 shadow-sm shadow-amber-500/20'
                  : 'bg-card-subtle text-dim border border-theme'
              }`}
            >
              <FlameIcon size={24} className={streak > 0 ? 'animate-pulse text-amber-500' : 'text-dim'} />
            </div>
            {hasStreakShield && (
              <div
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center border-2 border-card shadow-sm"
                title="Streak Shield Active"
              >
                <ShieldIcon size={11} />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-main tracking-tight">
                Daily Cleaning Streak
              </h3>
              {hasStreakShield && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30 text-[10px] font-mono font-bold">
                  SHIELDED
                </span>
              )}
            </div>
            <p className="text-xs text-sub mt-0.5">
              {isTodayCheckedIn
                ? 'Practice verified for today. Streak preserved!'
                : 'Pending daily check-in. Tap today to preserve streak.'}
            </p>
          </div>
        </div>

        {/* Big Tabular Streak Count */}
        <div className="text-right">
          <div className="flex items-baseline justify-end gap-1">
            <span className="font-mono text-3xl font-extrabold text-amber-500 leading-none">
              {streak}
            </span>
            <span className="text-xs font-mono font-semibold text-sub">
              {streak === 1 ? 'DAY' : 'DAYS'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-dim block mt-0.5">
            {checkedThisWeekCount}/7 THIS WEEK
          </span>
        </div>
      </div>

      {/* 7-Days Interactive Visual Tracker */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 my-4">
        {daysInfo.map((d) => {
          return (
            <div
              key={d.iso}
              onClick={d.isToday && !d.isChecked ? handleManualCheckIn : undefined}
              className={`relative flex flex-col items-center justify-between p-2 rounded-2xl transition-all ${
                d.isToday
                  ? d.isChecked
                    ? 'bg-amber-500/15 border-2 border-amber-500 shadow-sm'
                    : 'bg-account border-2 border-dashed border-[#84cc16] cursor-pointer hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(132,204,22,0.25)]'
                  : d.isChecked
                  ? 'bg-amber-500/10 border border-amber-500/30'
                  : d.isPast
                  ? 'bg-card-subtle border border-theme opacity-45'
                  : 'bg-card-subtle/50 border border-dashed border-theme opacity-65'
              }`}
            >
              {/* Day Header */}
              <div className="flex flex-col items-center">
                <span
                  className={`text-[10px] font-mono uppercase font-bold tracking-tight ${
                    d.isToday ? 'text-account' : d.isChecked ? 'text-amber-500' : 'text-sub'
                  }`}
                >
                  {d.shortDay}
                </span>
                <span className="text-[9px] font-mono text-dim mt-0.5">
                  {d.dateNumber}
                </span>
              </div>

              {/* Status Graphic: Clearly Demonstrates Checked vs Pending vs Missed */}
              <div className="my-2 flex items-center justify-center">
                {d.isChecked ? (
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-sm">
                    <CheckIcon size={14} strokeWidth={2.8} />
                  </div>
                ) : d.isToday ? (
                  <div className="w-6 h-6 rounded-full bg-[#84cc16]/20 border-2 border-[#84cc16] flex items-center justify-center text-[#84cc16] animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-[#84cc16]" />
                  </div>
                ) : d.isPast ? (
                  <div className="w-5 h-5 rounded-full border border-theme flex items-center justify-center text-dim text-[10px] font-mono">
                    —
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-dashed border-theme flex items-center justify-center text-dim/50 text-[10px] font-mono">
                    ·
                  </div>
                )}
              </div>

              {/* State Badge */}
              <div className="text-center">
                {d.isToday ? (
                  <span
                    className={`inline-block px-1.5 py-0.2 rounded text-[8px] font-mono font-extrabold ${
                      d.isChecked
                        ? 'bg-amber-500/20 text-amber-500'
                        : 'bg-[#84cc16] text-black shadow-sm'
                    }`}
                  >
                    {d.isChecked ? 'DONE' : 'TODAY'}
                  </span>
                ) : d.isChecked ? (
                  <span className="text-[8px] font-mono font-bold text-amber-500">
                    DONE
                  </span>
                ) : d.isPast ? (
                  <span className="text-[8px] font-mono text-dim">
                    MISSED
                  </span>
                ) : (
                  <span className="text-[8px] font-mono text-dim/60">
                    UPCOMING
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Progress Bar towards Sunday Reward */}
      <div className="mt-4 pt-3 border-t border-theme">
        <div className="flex items-center justify-between text-xs font-mono mb-1.5">
          <span className="text-sub flex items-center gap-1.5">
            <CalendarIcon size={13} className="text-account" />
            <span>Weekly Target: {checkedThisWeekCount}/7 Days</span>
          </span>
          <span className="text-amber-500 font-bold flex items-center gap-1">
            <SparklesIcon size={12} />
            <span>Day 7 Bounty: +100 Coins & +3 Gems</span>
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-card-subtle overflow-hidden border border-theme">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-[#84cc16] transition-all duration-500"
            style={{ width: `${weeklyProgressPercent}%` }}
          />
        </div>
      </div>

      {/* Action CTA: Click to Check In Today if Not Done */}
      {!isTodayCheckedIn && (
        <button
          type="button"
          onClick={handleManualCheckIn}
          className="mt-4 w-full py-3 px-4 rounded-2xl bg-account border-2 border-account text-account font-bold text-xs font-mono flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] shadow-md shadow-[#84cc16]/10 transition-all cursor-pointer"
        >
          <CheckIcon size={16} strokeWidth={2.5} />
          <span>Tap to Log Today's Practice (+10 XP, +5 Coins)</span>
        </button>
      )}
    </div>
  );
};
