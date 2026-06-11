import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { Scale5 } from '@/lib/types';

const fieldBase =
  'w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))]/60 px-4 py-3 text-[0.95rem] outline-none transition placeholder:text-soft focus:border-lavender focus:ring-2 focus:ring-lavender/40';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBase, className)} {...props} />
  ),
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldBase, 'resize-none leading-relaxed', className)} {...props} />
  ),
);
Textarea.displayName = 'Textarea';

export function Label({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-muted">
      {children}
      {hint && <span className="text-xs font-normal text-soft">· {hint}</span>}
    </label>
  );
}

/* Segmented control */
export function Segmented<T extends string>({
  value, onChange, options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
}) {
  return (
    <div className="inline-flex rounded-2xl bg-black/[0.04] p-1 dark:bg-white/[0.05]">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'focus-ring rounded-xl px-3.5 py-1.5 text-sm font-medium transition',
            value === o.value
              ? 'bg-[rgb(var(--surface))] text-indigo shadow-sm dark:text-lilac'
              : 'text-muted hover:text-[rgb(var(--text))]',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* 1..5 self-report scale with calm dots */
const SCALE_COLORS = ['#94a3b8', '#a78bfa', '#818cf8', '#34d399', '#fbbf24'];
export function ScaleSelector({
  value, onChange, lowLabel, highLabel,
}: {
  value: Scale5 | undefined;
  onChange: (v: Scale5) => void;
  lowLabel?: string;
  highLabel?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {([1, 2, 3, 4, 5] as Scale5[]).map((n) => {
          const active = value === n;
          return (
            <button
              key={n}
              onClick={() => onChange(n)}
              aria-label={`${n}`}
              className={cn(
                'focus-ring grid h-11 flex-1 place-items-center rounded-xl text-sm font-semibold transition active:scale-95',
                active ? 'text-white shadow-md' : 'bg-black/[0.04] text-muted hover:bg-black/[0.08] dark:bg-white/[0.05] dark:hover:bg-white/10',
              )}
              style={active ? { background: SCALE_COLORS[n - 1] } : undefined}
            >
              {n}
            </button>
          );
        })}
      </div>
      {(lowLabel || highLabel) && (
        <div className="mt-1 flex justify-between text-xs text-soft">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      )}
    </div>
  );
}
