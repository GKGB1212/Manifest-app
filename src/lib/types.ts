/* ------------------------------------------------------------------ *
 * Manifest — Domain model
 * A single source of truth for every persisted entity. The shapes mirror
 * a relational schema (see /docs/SCHEMA.md) so a Postgres/Prisma backend
 * can be dropped behind the repository layer with no UI changes.
 * ------------------------------------------------------------------ */

export type ID = string;
/** ISO-8601 timestamp */
export type ISODate = string;
/** YYYY-MM-DD local day key */
export type DayKey = string;

export type Language = 'en' | 'vi';
export type ThemeMode = 'system' | 'light' | 'dark';

export type LifeCategory =
  | 'wealth'
  | 'career'
  | 'confidence'
  | 'love'
  | 'health'
  | 'spirituality'
  | 'lifestyle'
  | 'travel'
  | 'relationship'
  | 'finance';

/** 1 (low) … 5 (radiant) — used for every self-report scale */
export type Scale5 = 1 | 2 | 3 | 4 | 5;

/* ------------------------------- User ------------------------------ */

export interface UserProfile {
  id: ID;
  name: string;
  avatarEmoji: string;
  createdAt: ISODate;
  timezone: string;
  /** computed conveniences kept denormalised for snappy UI */
  xp: number;
  level: number;
}

export interface Settings {
  language: Language;
  theme: ThemeMode;
  largeText: boolean;
  reduceMotion: boolean;
  soundEnabled: boolean;
  backgroundMusic: boolean;
  notificationsEnabled: boolean;
  reminders: ReminderPref[];
}

export interface ReminderPref {
  id: ID;
  kind: 'affirmation' | 'method369' | 'gratitude' | 'visualization' | 'journal' | 'mood';
  /** HH:mm 24h */
  time: string;
  enabled: boolean;
}

/* --------------------------- Affirmations -------------------------- */

export interface Affirmation {
  id: ID;
  text: string;
  category: LifeCategory;
  isCustom: boolean;
  isFavorite: boolean;
  /** total repetitions ever recorded */
  repetitions: number;
  voiceNoteId?: ID;
  createdAt: ISODate;
}

export interface AffirmationLog {
  id: ID;
  affirmationId: ID;
  day: DayKey;
  count: number;
  mirrorMode: boolean;
  createdAt: ISODate;
}

/* ----------------------- Structured methods ------------------------ */

/** 369 method — morning x3, afternoon x6, night x9 */
export type Phase369 = 'morning' | 'afternoon' | 'night';

export interface Method369Session {
  id: ID;
  day: DayKey;
  intention: string;
  affirmation: string;
  progress: Record<Phase369, number>; // completed reps per phase
  completed: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
}

/** 55x5 — write affirmation 55 times a day for 5 days */
export interface Method55x5Run {
  id: ID;
  intention: string;
  affirmation: string;
  startedAt: ISODate;
  /** index by day 0..4 -> reps written that day (target 55) */
  dayCounts: number[];
  completed: boolean;
}

/* ----------------------------- Journals ---------------------------- */

export type JournalKind = 'scripting' | 'free' | 'reflection';

export interface JournalEntry {
  id: ID;
  kind: JournalKind;
  title: string;
  body: string;
  emotions: string[];
  mood?: Scale5;
  goalId?: ID;
  photoIds: ID[];
  voiceNoteId?: ID;
  tags: string[];
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface GratitudeEntry {
  id: ID;
  day: DayKey;
  /** answers to the three rotating prompts */
  items: string[];
  mood?: Scale5;
  createdAt: ISODate;
}

/* --------------------------- Future self --------------------------- */

export type FutureHorizon = '6m' | '1y' | '5y';

export interface FutureSelfLetter {
  id: ID;
  horizon: FutureHorizon;
  title: string;
  body: string;
  /** for "conversations" mode: a transcript with the future self */
  conversation?: { role: 'me' | 'future'; text: string }[];
  createdAt: ISODate;
}

/* ----------------------------- Goals ------------------------------- */

export type GoalStatus = 'active' | 'achieved' | 'paused' | 'archived';

export interface ManifestationGoal {
  id: ID;
  title: string;
  category: LifeCategory;
  description: string;
  desiredOutcome: string;
  targetDate?: DayKey;
  importance: Scale5;
  emotionalIntensity: Scale5;
  status: GoalStatus;
  milestones: Milestone[];
  createdAt: ISODate;
  achievedAt?: ISODate;
}

export interface Milestone {
  id: ID;
  title: string;
  done: boolean;
  doneAt?: ISODate;
}

export type EvidenceKind =
  | 'sign'
  | 'synchronicity'
  | 'win'
  | 'opportunity'
  | 'progress';

export interface EvidenceItem {
  id: ID;
  goalId?: ID;
  kind: EvidenceKind;
  note: string;
  emotionalCharge: Scale5;
  createdAt: ISODate;
}

/* ------------------------- Mood & energy --------------------------- */

export interface MoodEntry {
  id: ID;
  day: DayKey;
  mood: Scale5;
  energy: Scale5;
  confidence: Scale5;
  stress: Scale5; // higher = more stressed
  gratitude: Scale5;
  selfBelief: Scale5;
  note?: string;
  createdAt: ISODate;
}

/* ------------------------- Visualization --------------------------- */

export interface VisualizationSession {
  id: ID;
  scriptId: string;
  title: string;
  durationSec: number;
  completedSec: number;
  completed: boolean;
  goalId?: ID;
  createdAt: ISODate;
}

/* --------------------------- Vision board -------------------------- */

export interface VisionBoard {
  id: ID;
  title: string;
  category: LifeCategory;
  items: VisionItem[];
  createdAt: ISODate;
}

export interface VisionItem {
  id: ID;
  /** data-URL or remote URL */
  image: string;
  caption: string;
  /** free placement on the board (percent of container) */
  x: number;
  y: number;
}

/* ------------------------- Gamification ---------------------------- */

export interface Achievement {
  id: string; // stable badge id
  unlockedAt?: ISODate;
  progress: number; // 0..1
}

export interface StreakState {
  current: number;
  longest: number;
  lastActiveDay?: DayKey;
}

/* --------------------------- AI coach ------------------------------ */

export interface CoachMessage {
  id: ID;
  role: 'user' | 'coach';
  text: string;
  createdAt: ISODate;
}

export interface CoachConversation {
  id: ID;
  title: string;
  messages: CoachMessage[];
  createdAt: ISODate;
  updatedAt: ISODate;
}

/* --------------------------- Media blobs --------------------------- */

export interface MediaBlob {
  id: ID;
  kind: 'voice' | 'photo';
  /** object stored as data-URL for portability */
  dataUrl: string;
  createdAt: ISODate;
}

/* --------------------------- Root state ---------------------------- */

export interface AppData {
  version: number;
  user: UserProfile;
  settings: Settings;
  affirmations: Affirmation[];
  affirmationLogs: AffirmationLog[];
  method369: Method369Session[];
  method55x5: Method55x5Run[];
  journal: JournalEntry[];
  gratitude: GratitudeEntry[];
  futureSelf: FutureSelfLetter[];
  goals: ManifestationGoal[];
  evidence: EvidenceItem[];
  moods: MoodEntry[];
  visualizations: VisualizationSession[];
  visionBoards: VisionBoard[];
  achievements: Achievement[];
  streak: StreakState;
  coach: CoachConversation[];
  media: MediaBlob[];
  /** day -> set of practice ids completed, drives streak + rings */
  activity: Record<DayKey, string[]>;
}
