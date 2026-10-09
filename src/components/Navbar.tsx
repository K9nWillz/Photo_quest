import React from 'react';
import { AppScreen, UserProfile } from '../types';
import {
  FlameIcon,
  CoinIcon,
  GemIcon,
  TrophyIcon,
  SettingsIcon,
  ListChecksIcon,
  PackageIcon,
  UserIcon,
  SwordsIcon,
  MoonIcon,
  SunIcon,
  SparklesIcon,
} from './icons';
import { Avatar } from './avatars';
import { triggerHaptic } from '../utils/audio';

interface NavbarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  profile: UserProfile;
  onOpenSettings: () => void;
  onOpenGemVault: () => void;
  onToggleTheme: () => void;
}

export const TopHeader: React.FC<{
  profile: UserProfile;
  currentScreen: AppScreen;
  onOpenSettings: () => void;
  onOpenGemVault: () => void;
  onNavigate: (screen: AppScreen) => void;
  onToggleTheme: () => void;
}> = ({ profile, currentScreen, onOpenSettings, onOpenGemVault, onNavigate, onToggleTheme }) => {
  const desktopNavItems: { screen: AppScreen; label: string; icon: React.ReactNode }[] = [
    { screen: 'home', label: 'Quest', icon: <ListChecksIcon size={16} /> },
    { screen: 'league', label: 'League', icon: <TrophyIcon size={16} /> },
    { screen: 'duel', label: 'Clean-Off Duel', icon: <SwordsIcon size={16} /> },
    { screen: 'locker', label: 'Armory', icon: <PackageIcon size={16} /> },
    { screen: 'profile', label: 'Dossier', icon: <UserIcon size={16} /> },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-card/90 backdrop-blur-md border-b border-theme px-4 sm:px-8 py-3 select-none transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand & Desktop Logo */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(10, profile.hapticsEnabled);
              onNavigate('home');
            }}
            className="flex items-center gap-2 group text-left"
          >
            <span className="font-serif text-2xl tracking-tight text-main group-hover:text-account transition-colors">
              Photo Quest
            </span>
          </button>

          {/* Desktop Navigation Links (Responsive PC/Tablet) */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Desktop Navigation">
            {desktopNavItems.map((item) => {
              const isActive = currentScreen === item.screen;
              return (
                <button
                  key={item.screen}
                  type="button"
                  onClick={() => {
                    triggerHaptic(10, profile.hapticsEnabled);
                    onNavigate(item.screen);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-account text-account font-semibold border border-account shadow-sm'
                      : 'text-sub hover:text-main hover:bg-card-elevated'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Stats & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Account Chip in LIME GREEN as requested */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(10, profile.hapticsEnabled);
              onNavigate('profile');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-account border border-account text-account text-xs font-mono font-semibold active:scale-95 transition-all"
            title="Account Dossier"
          >
            <span className="w-2 h-2 rounded-full bg-[#84cc16] animate-pulse" />
            <span className="hidden sm:inline">Operator</span>
            <span className="font-bold truncate max-w-[85px]">{profile.displayName}</span>
          </button>

          {/* Streak Chip */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs font-mono cursor-pointer hover:bg-amber-500/15 transition-colors"
          >
            <FlameIcon size={14} className="text-amber-500" />
            <span className="font-bold text-amber-500">{profile.streak}d</span>
          </div>

          {/* Coins Chip */}
          <div
            onClick={() => onNavigate('locker')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs font-mono cursor-pointer hover:bg-amber-500/15 transition-colors"
          >
            <CoinIcon size={14} className="text-amber-500" />
            <span className="font-bold text-amber-500">{profile.coins}</span>
          </div>

          {/* Gems Chip (Opens Gem Vault!) */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(15, profile.hapticsEnabled);
              onOpenGemVault();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-xs font-mono text-sky-400 hover:bg-sky-500/25 transition-all active:scale-95"
            title="Open Gem Power Vault"
          >
            <GemIcon size={13} className="text-sky-400 animate-bounce" />
            <span className="font-bold text-sky-400">{profile.gems}</span>
            <span className="hidden sm:inline text-[10px] text-sky-300 ml-0.5 font-bold">VAULT</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(10, profile.hapticsEnabled);
              onToggleTheme();
            }}
            className="w-8 h-8 rounded-xl bg-card-subtle hover:bg-card-elevated border border-theme flex items-center justify-center text-sub hover:text-main active:scale-95 transition-all"
            aria-label="Toggle dark/light theme"
          >
            {profile.theme === 'dark' ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(10, profile.hapticsEnabled);
              onOpenSettings();
            }}
            className="w-8 h-8 rounded-xl bg-card-subtle hover:bg-card-elevated border border-theme flex items-center justify-center text-sub hover:text-main active:scale-95 transition-all"
            aria-label="Open settings"
          >
            <SettingsIcon size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export const BottomNav: React.FC<NavbarProps> = ({ currentScreen, onNavigate, profile }) => {
  // Hide bottom nav during active photo shoot or verification screens
  const hideOnScreens = ['scan', 'verify'];
  if (hideOnScreens.includes(currentScreen)) return null;

  const tabs: { screen: AppScreen; label: string; icon: React.ReactNode }[] = [
    { screen: 'home', label: 'Quest', icon: <ListChecksIcon size={20} /> },
    { screen: 'league', label: 'League', icon: <TrophyIcon size={20} /> },
    { screen: 'duel', label: 'Duel', icon: <SwordsIcon size={20} /> },
    { screen: 'locker', label: 'Armory', icon: <PackageIcon size={20} /> },
    {
      screen: 'profile',
      label: 'Dossier',
      icon: (
        <Avatar
          type={profile.avatar}
          equippedItem={profile.equippedItem}
          showAccountRing
          size={22}
          className="border-0 bg-transparent rounded-none"
        />
      ),
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-theme pb-[env(safe-area-inset-bottom)] select-none transition-colors"
      role="navigation"
      aria-label="Mobile Navigation"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 h-14">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.screen;
          return (
            <button
              key={tab.screen}
              type="button"
              onClick={() => {
                triggerHaptic(15, profile.hapticsEnabled);
                onNavigate(tab.screen);
              }}
              className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
                isActive ? 'text-account font-bold' : 'text-sub hover:text-main'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 w-8 h-0.5 rounded-full bg-[#84cc16] shadow-[0_0_8px_rgba(132,204,22,0.8)]" />
              )}
              {tab.icon}
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
