import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  CrossIcon,
  MoonIcon,
  SunIcon,
  Volume2Icon,
  VolumeXIcon,
  VibrateIcon,
  InfoIcon,
  TrashIcon,
  UserIcon,
  LogOutIcon,
  CheckIcon,
} from './icons';
import { signOutUser } from '../firebase';
import { triggerHaptic } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenAuth: () => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onOpenAuth,
  onResetData,
}) => {
  const [showDevNotes, setShowDevNotes] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const toggleTheme = () => {
    triggerHaptic(10, profile.hapticsEnabled);
    onUpdateProfile({ theme: profile.theme === 'dark' ? 'light' : 'dark' });
  };

  const toggleSound = () => {
    triggerHaptic(10, profile.hapticsEnabled);
    onUpdateProfile({ soundEnabled: !profile.soundEnabled });
  };

  const toggleHaptics = () => {
    const next = !profile.hapticsEnabled;
    triggerHaptic(next ? 20 : 0, next);
    onUpdateProfile({ hapticsEnabled: next });
  };

  const handleSignOut = async () => {
    await signOutUser();
    onUpdateProfile({ email: undefined });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4 select-none">
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-theme p-6 shadow-2xl animate-in fade-in slide-in-from-bottom duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-theme">
          <h2 className="text-base font-bold text-main">System Configuration</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-card-subtle flex items-center justify-center text-sub hover:text-main"
            aria-label="Close settings"
          >
            <CrossIcon size={16} />
          </button>
        </div>

        {/* Account Row */}
        <div className="py-4 border-b border-theme flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-account border border-account flex items-center justify-center text-account">
              <UserIcon size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-main">{profile.displayName}</p>
              <p className="text-xs text-sub">
                {profile.email ? profile.email : 'Local Guest Account'}
              </p>
            </div>
          </div>
          {profile.email ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-xl bg-card-subtle hover:bg-card-elevated text-sub text-xs flex items-center gap-1.5 border border-theme"
            >
              <LogOutIcon size={14} />
              Sign Out
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-account border border-account text-account text-xs font-bold hover:opacity-90"
            >
              Sign Up
            </button>
          )}
        </div>

        {/* Preferences */}
        <div className="py-4 space-y-3.5 border-b border-theme">
          <p className="text-[11px] font-mono uppercase tracking-wider text-dim font-bold">Preferences</p>

          {/* Theme */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-main text-xs font-medium">
              {profile.theme === 'dark' ? <MoonIcon size={16} /> : <SunIcon size={16} />}
              <span>Interface Theme</span>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-xl bg-card-subtle border border-theme text-xs font-mono text-main capitalize hover:bg-card-elevated"
            >
              {profile.theme} Mode
            </button>
          </div>

          {/* Sound */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-main text-xs font-medium">
              {profile.soundEnabled ? <Volume2Icon size={16} /> : <VolumeXIcon size={16} />}
              <span>Web Audio Synthesizer</span>
            </div>
            <button
              type="button"
              onClick={toggleSound}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-colors ${
                profile.soundEnabled
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500 font-bold'
                  : 'bg-card-subtle border-theme text-dim'
              }`}
            >
              {profile.soundEnabled ? 'ACTIVE' : 'MUTED'}
            </button>
          </div>

          {/* Haptics */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-main text-xs font-medium">
              <VibrateIcon size={16} />
              <span>Haptic Feedback Engine</span>
            </div>
            <button
              type="button"
              onClick={toggleHaptics}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-colors ${
                profile.hapticsEnabled
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500 font-bold'
                  : 'bg-card-subtle border-theme text-dim'
              }`}
            >
              {profile.hapticsEnabled ? 'ACTIVE' : 'DISABLED'}
            </button>
          </div>
        </div>

        {/* API Telemetry Panel */}
        <div className="py-4 border-b border-theme">
          <p className="text-[11px] font-mono uppercase tracking-wider text-dim font-bold mb-2.5">
            Vision Pipeline Diagnostics
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-card-subtle border border-theme text-center">
              <p className="text-[10px] text-dim">Total Calls</p>
              <p className="text-base font-mono font-bold text-main mt-0.5">
                {profile.apiTelemetry.calls}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-card-subtle border border-theme text-center">
              <p className="text-[10px] text-dim">Fallbacks</p>
              <p className="text-base font-mono font-bold text-amber-500 mt-0.5">
                {profile.apiTelemetry.fallbackCount}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-card-subtle border border-theme text-center">
              <p className="text-[10px] text-dim">Backend API</p>
              <p className="text-base font-mono font-bold text-emerald-500 mt-0.5">Active</p>
            </div>
          </div>
        </div>

        {/* Developer Notes (Collapsible) */}
        <div className="py-4 border-b border-theme">
          <button
            type="button"
            onClick={() => setShowDevNotes(!showDevNotes)}
            className="w-full flex items-center justify-between text-xs text-sub hover:text-main"
          >
            <span className="font-mono uppercase tracking-wider text-[11px] font-bold flex items-center gap-1.5">
              <InfoIcon size={14} /> Developer Architecture Notes
            </span>
            <span className="font-mono">{showDevNotes ? '▲' : '▼'}</span>
          </button>

          {showDevNotes && (
            <div className="mt-3 p-3.5 rounded-2xl bg-card-subtle border border-theme text-xs text-sub space-y-2 leading-relaxed">
              <p>
                <strong className="text-main">Server-Side Proxy:</strong> All Gemini vision calls execute securely via server routes (<code className="font-mono text-violet-500">/api/scan</code> & <code className="font-mono text-violet-500">/api/verify</code>) using <code className="font-mono text-main">gemini-3.8-flash</code>.
              </p>
              <p>
                <strong className="text-main">Edge Density Fallback:</strong> If offline or rate-limited, the system falls back to a 48×48 luminance matrix difference algorithm with an identical 8% improvement pass gate.
              </p>
              <p>
                <strong className="text-main">Firebase Firestore:</strong> Connected via auto-detect long polling for high reliability across iframe sandboxes.
              </p>
            </div>
          )}
        </div>

        {/* Danger zone / Reset */}
        <div className="pt-4 flex items-center justify-between">
          <div className="text-xs text-dim">Reset local game progress</div>
          {confirmReset ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1.5 rounded-xl bg-card-subtle border border-theme text-sub text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetData();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                Confirm Reset
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="text-xs text-rose-500 hover:text-rose-400 font-semibold flex items-center gap-1"
            >
              <TrashIcon size={14} />
              Reset Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
