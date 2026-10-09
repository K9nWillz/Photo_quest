export type AvatarType =
  | 'fox'
  | 'owl'
  | 'whale'
  | 'cactus'
  | 'comet'
  | 'lotus'
  | 'geode'
  | 'ember'
  | 'frost'
  | 'moss';

export type EquipmentId =
  | 'none'
  | 'cap'
  | 'shades'
  | 'tophat'
  | 'bandana'
  | 'beret'
  | 'headset'
  | 'fedora'
  | 'helmet'
  | 'visor'
  | 'crown'
  | 'halo'
  | 'kabuto'
  | 'spacehelm'
  | 'valkyrie';

export type MonsterShape = 'horns' | 'ghost' | 'square' | 'spikes' | 'drip' | 'box' | 'tall';

export type RoomType = 'bedroom' | 'kitchen' | 'bathroom' | 'living_room' | 'office' | 'other';

export type GradeType = 'S' | 'A' | 'B' | 'C' | 'FAIL';

export interface MonsterItem {
  id: string;
  name: string;
  label: string;
  task: string;
  minutes: number;
  xp: number;
  box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000
  shape: MonsterShape;
  color: string;
  completed: boolean;
}

export interface SessionRecord {
  id: string;
  date: string;
  roomType: RoomType;
  messBefore: number;
  messAfter: number;
  improvement: number;
  grade: GradeType;
  durationSeconds: number;
  xpEarned: number;
  coinsEarned: number;
  gemsEarned: number;
  commentary: string;
  isFallback: boolean;
  remaining?: string[];
  beforeImage?: string;
  afterImage?: string;
  monstersCount?: number;
}

export interface GemBoosters {
  xpBoostSessionsLeft: number; // 2x XP boost
  hasStreakShield: boolean; // Protects against 1 missed day
  hasRadarActive: boolean; // Radar scanner
}

export interface UserProfile {
  id: string;
  displayName: string;
  email?: string;
  avatar: AvatarType;
  equippedItem: EquipmentId;
  ownedEquipment: EquipmentId[];
  level: number;
  xp: number;
  coins: number;
  gems: number;
  streak: number;
  lastPlayedDay: string; // YYYY-MM-DD
  checkedInDays: string[]; // List of YYYY-MM-DD days checked in this week
  boosters: GemBoosters;
  weekXp: number;
  weekStart: string;
  totalMessCleared: number;
  roomsCompleted: number;
  monstersBeaten: number;
  dailyQuestCount: number;
  dailyQuestDay: string;
  bestTimeSeconds: number;
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  hasCompletedOnboarding: boolean;
  history: SessionRecord[];
  apiTelemetry: {
    calls: number;
    fallbackCount: number;
    lastError?: string;
  };
}

export interface LeaderboardPlayer {
  id: string;
  displayName: string;
  avatar: AvatarType;
  equippedItem: EquipmentId;
  weekXp: number;
  totalXp: number;
  streak: number;
  isUser?: boolean;
  rank?: number;
  delta?: number;
}

export interface EquipmentItem {
  id: EquipmentId;
  name: string;
  cost: number;
  description: string;
  tier: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  current: number;
  target: number;
  category: 'streak' | 'cleaning' | 'speed' | 'cosmetics' | 'gems' | 'duels';
}

export interface GemItem {
  id: string;
  name: string;
  costGems: number;
  description: string;
  iconName: string;
}

export type AppScreen =
  | 'welcome'
  | 'home'
  | 'scan'
  | 'quest'
  | 'verify'
  | 'result_pass'
  | 'result_fail'
  | 'history'
  | 'league'
  | 'locker'
  | 'profile'
  | 'duel';
