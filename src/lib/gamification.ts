import type { DayKey } from './types';
import type { TKey } from './i18n';
import { addDays, diffDays } from './utils';

/* XP awarded per practice type. Reflection is valued highly to reward depth. */
export const XP = {
  affirmation: 5,
  method369: 20,
  method55x5: 25,
  journal: 15,
  gratitude: 12,
  mood: 8,
  visualization: 18,
  evidence: 10,
  goal: 15,
  futureSelf: 15,
  vision: 10,
} as const;

export type PracticeType = keyof typeof XP;

/** Smooth level curve: level n needs ~ 100 * n^1.35 cumulative XP. */
export function levelForXp(xp: number): number {
  let lvl = 1;
  while (xp >= xpForLevel(lvl + 1)) lvl++;
  return lvl;
}
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.round(100 * Math.pow(level - 1, 1.35));
}
export function levelProgress(xp: number): { level: number; into: number; need: number; ratio: number } {
  const level = levelForXp(xp);
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const into = xp - base;
  const need = next - base;
  return { level, into, need, ratio: need > 0 ? into / need : 1 };
}

/** Recompute streak from the activity map (days with >=1 practice). */
export function computeStreak(activity: Record<DayKey, string[]>, today: DayKey) {
  const active = new Set(Object.keys(activity).filter((d) => (activity[d]?.length ?? 0) > 0));
  // current streak: walk back from today (or yesterday if today empty)
  let current = 0;
  let cursor = active.has(today) ? today : addDays(today, -1);
  if (active.has(cursor)) {
    while (active.has(cursor)) {
      current++;
      cursor = addDays(cursor, -1);
    }
  }
  // longest streak across all active days
  const sorted = [...active].sort();
  let longest = 0;
  let run = 0;
  let prev: DayKey | null = null;
  for (const d of sorted) {
    if (prev && diffDays(d, prev) === 1) run++;
    else run = 1;
    longest = Math.max(longest, run);
    prev = d;
  }
  return { current, longest: Math.max(longest, current), lastActiveDay: sorted[sorted.length - 1] };
}

/** The daily practice "rings" — the core of the Today screen. */
export const DAILY_RINGS: { id: PracticeType; tKey: TKey; emoji: string }[] = [
  { id: 'affirmation', tKey: 'nav.affirmations', emoji: '📿' },
  { id: 'gratitude', tKey: 'nav.gratitude', emoji: '🌼' },
  { id: 'mood', tKey: 'nav.mood', emoji: '💜' },
  { id: 'visualization', tKey: 'nav.visualize', emoji: '🧘' },
];
