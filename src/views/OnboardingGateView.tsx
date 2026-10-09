import React, { useState } from 'react';
import { AvatarType, UserProfile } from '../types';
import { Avatar, AVATAR_OPTIONS } from '../components/avatars';
import {
  UserIcon,
  CheckIcon,
  SparklesIcon,
  AlertCircleIcon,
  RefreshCwIcon,
  ShieldIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from '../components/icons';
import { signInWithGoogle, signInAnonymouslyUser, saveUserProfileToFirestore } from '../firebase';
import { triggerHaptic, playTaskCompleteTone } from '../utils/audio';

interface OnboardingGateViewProps {
  onComplete: (newProfile: {
    id: string;
    displayName: string;
    email?: string;
    avatar: AvatarType;
  }) => void;
  onBack?: () => void;
  hapticsEnabled: boolean;
  soundEnabled: boolean;
}

export const OnboardingGateView: React.FC<OnboardingGateViewProps> = ({
  onComplete,
  onBack,
  hapticsEnabled,
  soundEnabled,
}) => {
  const [authMethod, setAuthMethod] = useState<'guest' | 'google'>('guest');
  const [operatorName, setOperatorName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType>('fox');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Google Sign-in
  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setStatusMessage('Connecting to Google Authentication…');
    triggerHaptic(20, hapticsEnabled);

    try {
      const user = await signInWithGoogle();
      if (!user) {
        // User closed the popup, cancel gracefully
        setIsSubmitting(false);
        setStatusMessage(null);
        return;
      }

      const assignedName = user.displayName || operatorName || 'Operator';
      setStatusMessage('Writing profile to Cloud Firestore database…');

      // Zero-stat profile initialization
      const profilePayload = {
        id: user.uid,
        displayName: assignedName,
        email: user.email || undefined,
        avatar: selectedAvatar,
        equippedItem: 'none',
        level: 1,
        xp: 0,
        weekXp: 0,
        coins: 0,
        gems: 0,
        streak: 0,
        roomsCompleted: 0,
        totalMessCleared: 0,
      };

      await saveUserProfileToFirestore(profilePayload);
      playTaskCompleteTone(1.2, soundEnabled);
      triggerHaptic([30, 20, 50], hapticsEnabled);

      onComplete({
        id: user.uid,
        displayName: assignedName,
        email: user.email || undefined,
        avatar: selectedAvatar,
      });
    } catch (err: unknown) {
      console.warn('Google onboarding error:', err);
      setErrorMessage('Google authentication could not be completed. You can choose a Guest Call-sign below.');
      setIsSubmitting(false);
      setStatusMessage(null);
    }
  };

  // Handle Guest Operator Registration
  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = operatorName.trim();
    if (!cleanName) {
      setErrorMessage('Please enter an Operator Call-sign name.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setStatusMessage('Registering operator in database…');
    triggerHaptic(20, hapticsEnabled);

    try {
      // Try anonymous auth so guest gets real Firestore auth UID
      const anonUser = await signInAnonymouslyUser();
      const targetId = anonUser?.uid || 'guest-' + Math.random().toString(36).substring(2, 10);

      const profilePayload = {
        id: targetId,
        displayName: cleanName,
        avatar: selectedAvatar,
        equippedItem: 'none',
        level: 1,
        xp: 0,
        weekXp: 0,
        coins: 0,
        gems: 0,
        streak: 0,
        roomsCompleted: 0,
        totalMessCleared: 0,
      };

      await saveUserProfileToFirestore(profilePayload);
      playTaskCompleteTone(1.2, soundEnabled);
      triggerHaptic([30, 20, 50], hapticsEnabled);

      onComplete({
        id: targetId,
        displayName: cleanName,
        avatar: selectedAvatar,
      });
    } catch (err: unknown) {
      console.warn('Guest registration error:', err);
      // Still proceed with local profile if offline
      onComplete({
        id: 'guest-' + Math.random().toString(36).substring(2, 10),
        displayName: cleanName,
        avatar: selectedAvatar,
      });
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between px-4 sm:px-8 py-10 max-w-xl mx-auto select-none bg-app text-main transition-colors">
      {/* Brand & Editorial Title */}
      <div>
        {onBack && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic(10, hapticsEnabled);
              onBack();
            }}
            className="mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-theme text-xs font-mono text-sub hover:text-main transition-colors"
          >
            <ArrowLeftIcon size={14} />
            <span>Back to Briefing</span>
          </button>
        )}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#84cc16] animate-pulse" />
          <p className="text-[10px] font-mono tracking-widest uppercase text-account font-bold">
            Mandatory Cadre Registration
          </p>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl text-main font-normal tracking-tight leading-[0.98]">
          Identity, <span className="italic text-sub">verified.</span>
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-sub leading-relaxed">
          Photo Quest requires every operator to initialize an authentic profile. Your stats, verified proof logs, and cleaning streak start fresh at zero in the database.
        </p>
      </div>

      {/* Main Registration Box */}
      <div className="my-6 p-6 sm:p-7 rounded-3xl bg-card border-2 border-theme shadow-xl space-y-6">
        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-card-subtle border border-theme text-xs font-mono">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              triggerHaptic(10, hapticsEnabled);
              setAuthMethod('guest');
            }}
            className={`py-2 rounded-xl transition-all font-semibold ${
              authMethod === 'guest'
                ? 'bg-account text-account border border-account shadow-sm'
                : 'text-sub hover:text-main'
            }`}
          >
            Guest Call-Sign
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              triggerHaptic(10, hapticsEnabled);
              setAuthMethod('google');
            }}
            className={`py-2 rounded-xl transition-all font-semibold ${
              authMethod === 'google'
                ? 'bg-account text-account border border-account shadow-sm'
                : 'text-sub hover:text-main'
            }`}
          >
            Google Sign-In
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircleIcon size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Status Notification */}
        {statusMessage && (
          <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/25 text-sky-500 text-xs flex items-center gap-2 animate-in fade-in">
            <RefreshCwIcon size={16} className="shrink-0 animate-spin" />
            <span className="font-mono">{statusMessage}</span>
          </div>
        )}

        {/* Form Body */}
        {authMethod === 'guest' ? (
          <form onSubmit={handleGuestSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-main uppercase tracking-wider font-mono mb-1.5">
                Operator Call-Sign (Display Name)
              </label>
              <input
                type="text"
                required
                maxLength={24}
                disabled={isSubmitting}
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                placeholder="e.g. K9nWillz, CommanderClean, Aria..."
                className="w-full px-4 py-3 rounded-2xl bg-card-subtle border border-theme text-main placeholder-dim text-sm focus:outline-none focus:border-account font-sans"
              />
              <p className="text-[10px] text-dim mt-1 font-mono">
                Visible to all competitors on weekly diamond leagues.
              </p>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-bold text-main uppercase tracking-wider font-mono mb-2">
                Choose Starting Geometric Sigil
              </label>
              <div className="grid grid-cols-5 gap-2">
                {AVATAR_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      triggerHaptic(10, hapticsEnabled);
                      setSelectedAvatar(opt.id);
                    }}
                    className={`p-2 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                      selectedAvatar === opt.id
                        ? 'bg-account border-account ring-2 ring-[#84cc16] scale-105'
                        : 'bg-card-subtle border-theme hover:bg-card-elevated'
                    }`}
                  >
                    <Avatar type={opt.id} size={36} className="border-0 bg-transparent rounded-none" />
                    <span className="text-[9px] font-mono text-main font-semibold mt-1 capitalize">
                      {opt.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting || !operatorName.trim()}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
                !operatorName.trim() || isSubmitting
                  ? 'bg-card-subtle text-dim border border-theme cursor-not-allowed'
                  : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/25 active:scale-98'
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCwIcon size={18} className="animate-spin" />
                  <span>Saving to Database…</span>
                </>
              ) : (
                <>
                  <span>Create Account & Save to Database</span>
                  <ArrowRightIcon size={18} />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-5 text-center">
            <p className="text-xs text-sub leading-relaxed">
              Authenticate via Google to bind your verified room records directly to your Google Cloud UID.
            </p>

            {/* Avatar Selector for Google Auth */}
            <div className="text-left">
              <label className="block text-xs font-bold text-main uppercase tracking-wider font-mono mb-2">
                Choose Starting Geometric Sigil
              </label>
              <div className="grid grid-cols-5 gap-2">
                {AVATAR_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      triggerHaptic(10, hapticsEnabled);
                      setSelectedAvatar(opt.id);
                    }}
                    className={`p-2 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                      selectedAvatar === opt.id
                        ? 'bg-account border-account ring-2 ring-[#84cc16] scale-105'
                        : 'bg-card-subtle border-theme hover:bg-card-elevated'
                    }`}
                  >
                    <Avatar type={opt.id} size={36} className="border-0 bg-transparent rounded-none" />
                    <span className="text-[9px] font-mono text-main font-semibold mt-1 capitalize">
                      {opt.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleGoogleAuth}
              className="w-full py-4 px-5 rounded-2xl bg-card-elevated hover:bg-card-subtle border border-theme text-main font-bold text-sm flex items-center justify-center gap-3 shadow-md active:scale-98 transition-all"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isSubmitting ? 'Authenticating…' : 'Sign in with Google & Save Profile'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Mandatory Protocol Footer Note */}
      <div className="text-center">
        <p className="text-[11px] font-mono text-dim flex items-center justify-center gap-1.5">
          <ShieldIcon size={14} className="text-account" />
          <span>Strict Identity Invariant: New profiles initialize with 0 XP, 0 Coins, 0 Logs.</span>
        </p>
      </div>
    </div>
  );
};
