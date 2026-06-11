import type { LifeCategory } from '../types';
import type { TKey } from '../i18n';

export interface CategoryMeta {
  key: LifeCategory;
  tKey: TKey;
  emoji: string;
  /** tailwind gradient stops */
  gradient: string;
  ring: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { key: 'wealth', tKey: 'cat.wealth', emoji: '🌿', gradient: 'from-emerald-400 to-teal-500', ring: '#10b981' },
  { key: 'career', tKey: 'cat.career', emoji: '🚀', gradient: 'from-indigo-500 to-violet-500', ring: '#6366f1' },
  { key: 'confidence', tKey: 'cat.confidence', emoji: '☀️', gradient: 'from-amber-400 to-orange-400', ring: '#fbbf24' },
  { key: 'love', tKey: 'cat.love', emoji: '💗', gradient: 'from-rose-400 to-pink-400', ring: '#fb7185' },
  { key: 'health', tKey: 'cat.health', emoji: '🌱', gradient: 'from-green-400 to-emerald-400', ring: '#34d399' },
  { key: 'spirituality', tKey: 'cat.spirituality', emoji: '🪷', gradient: 'from-violet-400 to-purple-500', ring: '#a78bfa' },
  { key: 'lifestyle', tKey: 'cat.lifestyle', emoji: '✨', gradient: 'from-fuchsia-400 to-violet-400', ring: '#c4b5fd' },
  { key: 'travel', tKey: 'cat.travel', emoji: '🌍', gradient: 'from-sky-400 to-cyan-400', ring: '#38bdf8' },
  { key: 'relationship', tKey: 'cat.relationship', emoji: '🤝', gradient: 'from-pink-400 to-rose-400', ring: '#f472b6' },
  { key: 'finance', tKey: 'cat.finance', emoji: '💎', gradient: 'from-cyan-400 to-blue-500', ring: '#22d3ee' },
];

export const categoryMeta = (key: LifeCategory): CategoryMeta =>
  CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[0];
