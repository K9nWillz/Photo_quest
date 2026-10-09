import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signInAnonymously,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { LeaderboardPlayer } from './types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
    },
    operationType,
    path,
  };
  console.warn('Firestore Handled Warning: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with auto-detect long polling for iframe compatibility
let firestoreInstance: Firestore;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      experimentalAutoDetectLongPolling: true,
    },
    firebaseConfig.firestoreDatabaseId
  );
} catch {
  firestoreInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}

export const db: Firestore = firestoreInstance;
export const auth = getAuth(app);

// Test connection on boot with timeout
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 2500)
    );
    await Promise.race([getDocFromServer(doc(db, 'test', 'connection')), timeoutPromise]);
    return true;
  } catch (error) {
    // Offline mode is active and expected in sandbox or restricted network environments
    return false;
  }
}

// Google Sign-In via popup with graceful cancellation handling
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  const provider = new GoogleAuthProvider();
  try {
    const cred = await signInWithPopup(auth, provider);
    return cred.user;
  } catch (err: unknown) {
    const errorObj = err as { code?: string; message?: string };
    if (
      errorObj?.code === 'auth/popup-closed-by-user' ||
      errorObj?.code === 'auth/cancelled-popup-request' ||
      errorObj?.code === 'auth/user-cancelled'
    ) {
      // User closed the popup window - not a systemic error
      return null;
    }
    console.warn('Google sign-in attempt:', errorObj?.message || err);
    throw err;
  }
}

// Anonymous sign-in for guests
export async function signInAnonymouslyUser(): Promise<FirebaseUser | null> {
  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (err: unknown) {
    console.warn('Anonymous sign-in unavailable or disabled:', err);
    return null;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.warn('Sign out notice:', err);
  }
}

// Save complete user profile to Firestore database
export async function saveUserProfileToFirestore(profile: {
  id: string;
  displayName: string;
  avatar: string;
  equippedItem?: string;
  level: number;
  xp: number;
  weekXp: number;
  coins: number;
  gems: number;
  streak: number;
  roomsCompleted: number;
  totalMessCleared: number;
}): Promise<{ success: boolean; uid: string }> {
  let currentUid = auth.currentUser?.uid;
  if (!currentUid) {
    try {
      const anon = await signInAnonymously(auth);
      currentUid = anon.user.uid;
    } catch (e) {
      console.warn('Anonymous sign-in on save fallback:', e);
    }
  }

  const targetId = currentUid || profile.id;

  try {
    const savePromise = Promise.all([
      setDoc(
        doc(db, 'users', targetId),
        {
          id: targetId,
          displayName: profile.displayName,
          avatar: profile.avatar,
          equippedItem: profile.equippedItem || 'none',
          level: Number(profile.level) || 1,
          xp: Number(profile.xp) || 0,
          coins: Number(profile.coins) || 0,
          gems: Number(profile.gems) || 0,
          streak: Number(profile.streak) || 0,
          sessionsCount: Number(profile.roomsCompleted) || 0,
          totalMessCleared: Number(profile.totalMessCleared) || 0,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      ),
      setDoc(
        doc(db, 'leaderboard', targetId),
        {
          id: targetId,
          userId: currentUid || targetId,
          displayName: profile.displayName,
          avatar: profile.avatar,
          equippedItem: profile.equippedItem || 'none',
          weekXp: Number(profile.weekXp) || 0,
          totalXp: Number(profile.xp) || 0,
          streak: Number(profile.streak) || 0,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      ),
    ]);

    // Give Firestore up to 3.5 seconds so UI is never stuck on slow networks
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3500));
    await Promise.race([savePromise, timeoutPromise]);
    return { success: true, uid: targetId };
  } catch (err) {
    console.warn('Database save deferred or restricted:', err);
    return { success: false, uid: targetId };
  }
}

// Sync user score to Firestore leaderboard
export async function syncScoreToLeaderboard(player: LeaderboardPlayer): Promise<void> {
  if (!auth.currentUser) return;
  const path = `leaderboard/${player.id}`;
  try {
    await setDoc(
      doc(db, 'leaderboard', player.id),
      {
        id: player.id,
        userId: auth.currentUser.uid,
        displayName: player.displayName,
        avatar: player.avatar,
        equippedItem: player.equippedItem || 'none',
        weekXp: player.weekXp,
        totalXp: player.totalXp,
        streak: player.streak,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    // If offline or network constrained, don't crash app
    console.warn('Leaderboard sync deferred:', error);
  }
}

// Fetch live community leaderboard from Firestore
export async function fetchLiveLeaderboard(): Promise<LeaderboardPlayer[]> {
  const path = 'leaderboard';
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Leaderboard fetch timeout')), 2500)
    );
    const q = query(collection(db, 'leaderboard'), orderBy('weekXp', 'desc'), limit(25));
    const snapshot = await Promise.race([getDocs(q), timeoutPromise]);
    const players: LeaderboardPlayer[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      players.push({
        id: data.id || d.id,
        displayName: data.displayName || 'Cleaner',
        avatar: data.avatar || 'fox',
        equippedItem: data.equippedItem || 'none',
        weekXp: Number(data.weekXp || 0),
        totalXp: Number(data.totalXp || 0),
        streak: Number(data.streak || 0),
        isUser: auth.currentUser ? data.userId === auth.currentUser.uid : false,
      });
    });
    return players;
  } catch (error) {
    // Graceful fallback to rich local seed players
    return [];
  }
}
