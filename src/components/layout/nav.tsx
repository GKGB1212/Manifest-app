import {
  Sun, Quote, Repeat, NotebookPen, Flower2, Target, Images, Brain,
  Smile, Send, Sparkles, BarChart3, Trophy, Settings, type LucideIcon,
} from 'lucide-react';
import type { TKey } from '@/lib/i18n';

export interface NavItem {
  to: string;
  tKey: TKey;
  icon: LucideIcon;
  group: 'main' | 'practice' | 'reflect' | 'grow' | 'system';
}

export const NAV: NavItem[] = [
  { to: '/', tKey: 'nav.today', icon: Sun, group: 'main' },

  { to: '/affirmations', tKey: 'nav.affirmations', icon: Quote, group: 'practice' },
  { to: '/methods', tKey: 'nav.methods', icon: Repeat, group: 'practice' },
  { to: '/visualize', tKey: 'nav.visualize', icon: Brain, group: 'practice' },

  { to: '/journal', tKey: 'nav.journal', icon: NotebookPen, group: 'reflect' },
  { to: '/gratitude', tKey: 'nav.gratitude', icon: Flower2, group: 'reflect' },
  { to: '/mood', tKey: 'nav.mood', icon: Smile, group: 'reflect' },
  { to: '/future', tKey: 'nav.futureSelf', icon: Send, group: 'reflect' },

  { to: '/goals', tKey: 'nav.goals', icon: Target, group: 'grow' },
  { to: '/vision', tKey: 'nav.vision', icon: Images, group: 'grow' },
  { to: '/coach', tKey: 'nav.coach', icon: Sparkles, group: 'grow' },
  { to: '/insights', tKey: 'nav.analytics', icon: BarChart3, group: 'grow' },
  { to: '/achievements', tKey: 'nav.achievements', icon: Trophy, group: 'grow' },

  { to: '/settings', tKey: 'nav.settings', icon: Settings, group: 'system' },
];

export const NAV_GROUPS: { id: 'practice' | 'reflect' | 'grow'; tKey: TKey }[] = [
  { id: 'practice', tKey: 'nav.groups.practice' },
  { id: 'reflect', tKey: 'nav.groups.reflect' },
  { id: 'grow', tKey: 'nav.groups.grow' },
];

/** Five primary destinations for the mobile bottom bar. */
export const MOBILE_PRIMARY = ['/', '/affirmations', '/journal', '/goals'];
