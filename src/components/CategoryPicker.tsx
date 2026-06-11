import { CATEGORIES } from '@/lib/data/categories';
import type { LifeCategory } from '@/lib/types';
import { useT } from '@/hooks/useT';
import { cn } from '@/lib/utils';

export function CategoryPicker({
  value, onChange, compact,
}: { value: LifeCategory; onChange: (c: LifeCategory) => void; compact?: boolean }) {
  const { t } = useT();
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((c) => {
        const active = c.key === value;
        return (
          <button
            key={c.key}
            type="button"
            onClick={() => onChange(c.key)}
            className={cn(
              'focus-ring inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition active:scale-95',
              active
                ? 'border-transparent bg-indigo text-white shadow-[0_8px_20px_-8px_rgba(79,70,229,0.7)]'
                : 'border-[rgb(var(--border))] text-muted hover:bg-black/5 dark:hover:bg-white/5',
            )}
          >
            <span>{c.emoji}</span>
            {!compact && t(c.tKey)}
          </button>
        );
      })}
    </div>
  );
}
