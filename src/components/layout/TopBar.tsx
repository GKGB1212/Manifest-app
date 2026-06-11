import { Flame, Moon, Sun } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { IconButton } from '@/components/ui/primitives';
import { useStore, useSettings } from '@/lib/store';
import { useT } from '@/hooks/useT';
import { partOfDay } from '@/lib/utils';

export function TopBar() {
  const { t } = useT();
  const user = useStore((s) => s.data.user);
  const streak = useStore((s) => s.data.streak);
  const { theme } = useSettings();
  const setTheme = useStore((s) => s.setTheme);
  const greet =
    partOfDay() === 'morning' ? 'greet.morning'
      : partOfDay() === 'afternoon' ? 'greet.afternoon'
        : partOfDay() === 'evening' ? 'greet.evening' : 'greet.night';

  const isDark = document.documentElement.classList.contains('dark');

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[rgb(var(--border))]/50 bg-[rgb(var(--bg))]/70 px-4 py-3 backdrop-blur-xl lg:hidden">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">
          {t(greet)}{user.name ? `, ${user.name}` : ''} 🌙
        </div>
        <div className="text-xs text-soft">{t('tagline')}</div>
      </div>
      <div className="flex items-center gap-1.5">
        {streak.current > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-bold text-amber-500">
            <Flame size={13} /> {streak.current}
          </span>
        )}
        <LanguageToggle />
        <IconButton
          label="Theme"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </IconButton>
      </div>
    </header>
  );
}
