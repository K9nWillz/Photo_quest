import React, { useState } from 'react';
import { CrossIcon, CheckIcon, AlertCircleIcon, UserIcon } from './icons';
import { signInWithGoogle } from '../firebase';
import { triggerHaptic } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAuthenticated: (user: { uid: string; displayName: string; email?: string }) => void;
  currentName: string;
  onUpdateName: (name: string) => void;
  hapticsEnabled: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onUserAuthenticated,
  currentName,
  onUpdateName,
  hapticsEnabled,
}) => {
  const [nickname, setNickname] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    triggerHaptic(20, hapticsEnabled);

    try {
      const user = await signInWithGoogle();
      if (user) {
        onUserAuthenticated({
          uid: user.uid,
          displayName: user.displayName || nickname,
          email: user.email || undefined,
        });
        onClose();
      }
    } catch (err: unknown) {
      setErrorMsg('Google login was interrupted. You can continue with your custom nickname below.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    triggerHaptic(15, hapticsEnabled);
    onUpdateName(nickname.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4 select-none">
      <div
        className="w-full max-w-sm rounded-3xl bg-card border border-theme p-6 shadow-2xl animate-in fade-in slide-in-from-bottom duration-300"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b border-theme">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-account border border-account flex items-center justify-center text-account">
              <UserIcon size={18} />
            </div>
            <h2 className="text-base font-bold text-main">Operator Identity</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-card-subtle flex items-center justify-center text-sub hover:text-main"
            aria-label="Close modal"
          >
            <CrossIcon size={16} />
          </button>
        </div>

        <p className="text-xs text-sub my-4 leading-relaxed">
          Sign in to backup verified proof-of-clean scores, compete on global weekly leaderboards, and preserve streaks across devices.
        </p>

        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
            <AlertCircleIcon size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google Continue button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-card-elevated hover:opacity-90 border border-theme text-main font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 active:scale-98 transition-all shadow-sm mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          {isLoading ? 'Connecting to Google...' : 'Continue with Google'}
        </button>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-theme" />
          <span className="flex-shrink mx-2 text-[10px] font-mono text-dim uppercase tracking-widest">
            or custom nickname
          </span>
          <div className="flex-grow border-t border-theme" />
        </div>

        {/* Guest Nickname Form */}
        <form onSubmit={handleSaveNickname} className="mt-3 space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-sub mb-1">
              Leaderboard Display Name
            </label>
            <input
              type="text"
              maxLength={24}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. CommanderClean"
              className="w-full px-3.5 py-2.5 rounded-xl bg-card-subtle border border-theme text-main placeholder-dim text-sm focus:outline-none focus:border-account font-sans"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-account border border-account text-account hover:opacity-90 font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <CheckIcon size={16} />
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};
