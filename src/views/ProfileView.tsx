import React, { useState } from 'react';
import { UserProfile, AvatarType, BadgeItem } from '../types';
import { Avatar, AVATAR_OPTIONS } from '../components/avatars';
import {
  FlameIcon,
  CoinIcon,
  GemIcon,
  ZapIcon,
  SettingsIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldIcon,
  PackageIcon,
  TrophyIcon,
  InfoIcon,
  SparklesIcon,
  SwordsIcon,
} from '../components/icons';
import { triggerHaptic } from '../utils/audio';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateAvatar: (avatar: AvatarType) => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  onOpenGemVault: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateAvatar,
  onOpenSettings,
  onOpenAuth,
  onOpenGemVault,
}) => {
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'streak' | 'cleaning' | 'speed' | 'cosmetics' | 'gems'>('all');

  // XP to next level formula (each level requires level * 250 XP)
  const xpCurrentLevelBase = (profile.level - 1) * 250;
  const xpNextLevelTarget = profile.level * 250;
  const xpInCurrentLevel = Math.max(0, profile.xp - xpCurrentLevelBase);
  const xpNeeded = xpNextLevelTarget - xpCurrentLevelBase;
  const levelProgress = Math.min(100, Math.round((xpInCurrentLevel / xpNeeded) * 100));

  // Expanded Comprehensive 20+ Badges
  const allBadges: BadgeItem[] = [
    {
      id: 'first_session',
      title: 'First Cleared',
      description: 'Complete 1 verified cleaning session',
      unlocked: profile.roomsCompleted >= 1,
      current: profile.roomsCompleted,
      target: 1,
      category: 'cleaning',
    },
    {
      id: 'streak_3',
      title: '3-Day Spark',
      description: 'Log 3 consecutive days of room order',
      unlocked: profile.streak >= 3,
      current: profile.streak,
      target: 3,
      category: 'streak',
    },
    {
      id: 'week_streak',
      title: '7-Day Discipline',
      description: 'Maintain a full 7-day cleaning streak',
      unlocked: profile.streak >= 7,
      current: profile.streak,
      target: 7,
      category: 'streak',
    },
    {
      id: 'streak_14',
      title: '14-Day Iron Will',
      description: 'Two full weeks of unbroken discipline',
      unlocked: profile.streak >= 14,
      current: profile.streak,
      target: 14,
      category: 'streak',
    },
    {
      id: 'streak_30',
      title: '30-Day Master',
      description: 'One complete month of certified clean rooms',
      unlocked: profile.streak >= 30,
      current: profile.streak,
      target: 30,
      category: 'streak',
    },
    {
      id: 'task_slayer',
      title: '20 Tasks Banished',
      description: 'Eliminate 20 physical clutter clusters',
      unlocked: profile.monstersBeaten >= 20,
      current: profile.monstersBeaten,
      target: 20,
      category: 'cleaning',
    },
    {
      id: 'task_century',
      title: '50 Clutter Scourge',
      description: 'Eradicate 50 clutter nodes in real life',
      unlocked: profile.monstersBeaten >= 50,
      current: profile.monstersBeaten,
      target: 50,
      category: 'cleaning',
    },
    {
      id: 'task_titan',
      title: '100 Boss Slayer',
      description: 'Conquer 100 room monsters through real action',
      unlocked: profile.monstersBeaten >= 100,
      current: profile.monstersBeaten,
      target: 100,
      category: 'cleaning',
    },
    {
      id: 'sub_10',
      title: 'Tactical Velocity',
      description: 'Verify a room in under 10 minutes',
      unlocked: profile.bestTimeSeconds > 0 && profile.bestTimeSeconds < 600,
      current: profile.bestTimeSeconds > 0 && profile.bestTimeSeconds < 600 ? 1 : 0,
      target: 1,
      category: 'speed',
    },
    {
      id: 'sub_5',
      title: 'Supersonic Sweep',
      description: 'Complete full room verification in sub-5 minutes',
      unlocked: profile.bestTimeSeconds > 0 && profile.bestTimeSeconds < 300,
      current: profile.bestTimeSeconds > 0 && profile.bestTimeSeconds < 300 ? 1 : 0,
      target: 1,
      category: 'speed',
    },
    {
      id: 'veteran',
      title: '10 Sessions Cadre',
      description: 'Complete 10 verified clean rooms',
      unlocked: profile.roomsCompleted >= 10,
      current: profile.roomsCompleted,
      target: 10,
      category: 'cleaning',
    },
    {
      id: 'master_25',
      title: '25 Sessions Veteran',
      description: 'Reach 25 verified clean room milestones',
      unlocked: profile.roomsCompleted >= 25,
      current: profile.roomsCompleted,
      target: 25,
      category: 'cleaning',
    },
    {
      id: 'collector',
      title: 'Armory Collector',
      description: 'Acquire 3 distinct cosmetic items',
      unlocked: profile.ownedEquipment.length >= 3,
      current: profile.ownedEquipment.length,
      target: 3,
      category: 'cosmetics',
    },
    {
      id: 'wardrobe_6',
      title: 'Fashion Icon',
      description: 'Own 6 diverse armory headwear pieces',
      unlocked: profile.ownedEquipment.length >= 6,
      current: profile.ownedEquipment.length,
      target: 6,
      category: 'cosmetics',
    },
    {
      id: 'armory_master',
      title: 'Vault Sovereign',
      description: 'Collect 10 rare cosmetic equipment artifacts',
      unlocked: profile.ownedEquipment.length >= 10,
      current: profile.ownedEquipment.length,
      target: 10,
      category: 'cosmetics',
    },
    {
      id: 'grade_s',
      title: 'S-Tier Standard',
      description: 'Attain an S-grade verification (50%+ & <10m)',
      unlocked: profile.history.some((s) => s.grade === 'S'),
      current: profile.history.filter((s) => s.grade === 'S').length,
      target: 1,
      category: 'speed',
    },
    {
      id: 'triple_s',
      title: 'Triple S Elite',
      description: 'Achieve 3 separate S-grade verified clears',
      unlocked: profile.history.filter((s) => s.grade === 'S').length >= 3,
      current: profile.history.filter((s) => s.grade === 'S').length,
      target: 3,
      category: 'speed',
    },
    {
      id: 'mess_master',
      title: '100% Cleared',
      description: 'Accumulate 100% total clutter reduction',
      unlocked: profile.totalMessCleared >= 100,
      current: profile.totalMessCleared,
      target: 100,
      category: 'cleaning',
    },
    {
      id: 'mess_legend',
      title: '250% Total Clean',
      description: 'Accumulate 250% total clutter reduction score',
      unlocked: profile.totalMessCleared >= 250,
      current: profile.totalMessCleared,
      target: 250,
      category: 'cleaning',
    },
    {
      id: 'gem_hoard',
      title: '25 Gems Stash',
      description: 'Accumulate 25 prismatic gems',
      unlocked: profile.gems >= 25,
      current: profile.gems,
      target: 25,
      category: 'gems',
    },
    {
      id: 'gem_tycoon',
      title: '50 Gems Vault',
      description: 'Accumulate 50 prismatic gems',
      unlocked: profile.gems >= 50,
      current: profile.gems,
      target: 50,
      category: 'gems',
    },
  ];

  const filteredBadges = allBadges.filter(
    (b) => badgeFilter === 'all' || b.category === badgeFilter
  );

  return (
    <div className="px-4 sm:px-8 py-6 max-w-5xl mx-auto space-y-6 pb-28 select-none transition-colors">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono tracking-widest uppercase text-account font-bold">
            Cadre Dossier
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-main font-normal">Operator Profile</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(10, profile.hapticsEnabled);
              onOpenGemVault();
            }}
            className="px-3 py-1.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-500 text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-sky-500/25 transition-all"
          >
            <GemIcon size={14} />
            <span>Vault ({profile.gems})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(10, profile.hapticsEnabled);
              onOpenSettings();
            }}
            className="w-9 h-9 rounded-xl bg-card border border-theme flex items-center justify-center text-sub hover:text-main"
            aria-label="Settings"
          >
            <SettingsIcon size={18} />
          </button>
        </div>
      </div>

      {/* Operator Card (with LIME GREEN Account Theme as requested!) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-card border-2 border-account shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10, profile.hapticsEnabled);
                setShowAvatarPicker(!showAvatarPicker);
              }}
              className="group relative"
              aria-label="Change geometric avatar"
            >
              <Avatar
                type={profile.avatar}
                equippedItem={profile.equippedItem}
                showAccountRing
                size={70}
                className="cursor-pointer shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#84cc16] text-[8px] font-mono text-black font-bold border border-black/20">
                EDIT
              </span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-main">{profile.displayName}</h2>
                {/* LIME GREEN OPERATOR STATUS BADGE */}
                <span className="px-2 py-0.5 rounded-full bg-account text-account border border-account text-[10px] font-mono font-bold tracking-wider">
                  ACTIVE OPERATOR
                </span>
              </div>
              <p className="text-xs text-sub font-mono mt-0.5">
                {profile.email ? profile.email : 'Local Guest Account (Data synced to device)'}
              </p>
              <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-dim">
                <span>Rank: <strong className="text-account">Lvl {profile.level}</strong></span>
                <span>•</span>
                <span>Equipped: <strong className="text-main capitalize">{profile.equippedItem}</strong></span>
              </div>
            </div>
          </div>

          <div className="sm:text-right">
            {!profile.email ? (
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-account border border-account text-account hover:opacity-90 font-mono text-xs font-bold shadow-sm"
              >
                Sign In to Cloud
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card-subtle border border-theme text-xs font-mono text-sub">
                <CheckCircleIcon size={14} className="text-[#84cc16]" />
                <span>Verified Account</span>
              </div>
            )}
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="pt-2 border-t border-theme">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-sub">Level {profile.level} Progress</span>
            <span className="text-account font-bold">{xpInCurrentLevel} / {xpNeeded} XP ({levelProgress}%)</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-card-subtle border border-theme overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#84cc16] via-amber-400 to-violet-500 transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>

        {/* 10 Avatar Geometric Shapes Picker Drawer */}
        {showAvatarPicker && (
          <div className="pt-3 border-t border-theme space-y-2 animate-in fade-in duration-200">
            <p className="text-[10px] font-mono text-sub uppercase tracking-wider">
              Select Abstract Form
            </p>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {AVATAR_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic(15, profile.hapticsEnabled);
                    onUpdateAvatar(opt.id);
                    setShowAvatarPicker(false);
                  }}
                  className={`p-1.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    profile.avatar === opt.id
                      ? 'bg-account border-account scale-105'
                      : 'bg-card-subtle border-theme hover:bg-card-elevated'
                  }`}
                >
                  <Avatar type={opt.id} size={32} className="border-0 bg-transparent rounded-none" />
                  <span className="text-[9px] font-mono text-main mt-1 capitalize">{opt.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4 Core Stat Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-theme flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 shrink-0">
            <FlameIcon size={20} />
          </div>
          <div>
            <p className="text-[10px] font-mono text-sub uppercase">Active Streak</p>
            <p className="text-xl font-mono font-bold text-main">{profile.streak} Days</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-theme flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center text-violet-500 shrink-0">
            <ZapIcon size={20} />
          </div>
          <div>
            <p className="text-[10px] font-mono text-sub uppercase">Week XP</p>
            <p className="text-xl font-mono font-bold text-main">{profile.weekXp}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-theme flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 shrink-0">
            <CoinIcon size={20} />
          </div>
          <div>
            <p className="text-[10px] font-mono text-sub uppercase">Coins</p>
            <p className="text-xl font-mono font-bold text-amber-500">{profile.coins}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-theme flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-500 shrink-0">
            <GemIcon size={20} />
          </div>
          <div>
            <p className="text-[10px] font-mono text-sub uppercase">Prism Gems</p>
            <p className="text-xl font-mono font-bold text-sky-500">{profile.gems}</p>
          </div>
        </div>
      </div>

      {/* Expanded Badges Showcase */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-main font-mono uppercase tracking-wider">
              Achievement Badges ({allBadges.filter((b) => b.unlocked).length}/{allBadges.length})
            </h3>
            <p className="text-xs text-sub">Proof-of-clean operational accomplishments</p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-1 text-[11px] font-mono">
            {(['all', 'streak', 'cleaning', 'speed', 'cosmetics', 'gems'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setBadgeFilter(cat)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                  badgeFilter === cat
                    ? 'bg-account text-account font-bold border border-account'
                    : 'bg-card border border-theme text-sub hover:text-main'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid (Responsive PC & Mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between min-h-[140px] transition-all shadow-sm ${
                badge.unlocked
                  ? 'bg-card border-amber-500/40 shadow-amber-500/5'
                  : 'bg-card-subtle border-theme'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      badge.unlocked
                        ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                        : 'bg-card-subtle text-dim border border-theme'
                    }`}
                  >
                    <TrophyIcon size={18} />
                  </div>
                  <span
                    className={`text-[9px] font-mono font-bold uppercase tracking-wider ${
                      badge.unlocked ? 'text-amber-500' : 'text-dim'
                    }`}
                  >
                    {badge.unlocked ? 'UNLOCKED' : `${badge.current}/${badge.target}`}
                  </span>
                </div>

                <h4 className={`text-xs font-bold mt-2.5 ${badge.unlocked ? 'text-main' : 'text-sub'}`}>
                  {badge.title}
                </h4>
                <p className="text-[11px] text-sub mt-1 leading-snug line-clamp-2">
                  {badge.description}
                </p>
              </div>

              {/* Progress Mini Bar for locked badges */}
              <div className="mt-3">
                <div className="w-full h-1.5 rounded-full bg-card border border-theme overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      badge.unlocked ? 'bg-amber-500' : 'bg-sub'
                    }`}
                    style={{ width: `${Math.min(100, (badge.current / badge.target) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
