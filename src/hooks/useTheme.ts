import { useEffect } from 'react';
import { useSettings } from '@/lib/store';

/** Applies theme + accessibility settings to <html> as side effects. */
export function useApplyChrome() {
  const { theme, largeText, reduceMotion } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mql.matches);
      root.classList.toggle('dark', dark);
    };
    apply();
    if (theme === 'system') {
      mql.addEventListener('change', apply);
      return () => mql.removeEventListener('change', apply);
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.largeText = String(largeText);
  }, [largeText]);

  useEffect(() => {
    document.documentElement.dataset.reduceMotion = String(reduceMotion);
  }, [reduceMotion]);
}
