import { useStore, useLang } from '@/lib/store';
import { cn } from '@/lib/utils';

/** Compact EN / VI pill switcher. */
export function LanguageToggle({ className }: { className?: string }) {
  const lang = useLang();
  const setLanguage = useStore((s) => s.setLanguage);
  return (
    <div className={cn('inline-flex items-center rounded-full bg-black/[0.05] p-0.5 text-xs font-semibold dark:bg-white/[0.07]', className)}>
      {(['en', 'vi'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLanguage(l)}
          className={cn(
            'focus-ring rounded-full px-2.5 py-1 uppercase transition',
            lang === l ? 'bg-[rgb(var(--surface))] text-indigo shadow-sm dark:text-lilac' : 'text-soft',
          )}
          aria-pressed={lang === l}
        >
          {l === 'en' ? 'EN' : 'VI'}
        </button>
      ))}
    </div>
  );
}
