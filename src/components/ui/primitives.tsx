import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ------------------------------- Button ---------------------------- */

type Variant = 'primary' | 'soft' | 'ghost' | 'outline' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'btn-grad text-white hover:brightness-110',
  soft: 'bg-lavender/15 text-indigo dark:text-lilac hover:bg-lavender/25',
  ghost: 'text-muted hover:bg-black/5 dark:hover:bg-white/5',
  outline: 'border border-[rgb(var(--border))] hover:bg-black/5 dark:hover:bg-white/5',
  success: 'bg-success/90 text-white hover:bg-success',
};
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-xl',
  md: 'h-11 px-5 text-[0.95rem] gap-2 rounded-2xl',
  lg: 'h-14 px-7 text-base gap-2.5 rounded-2xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', block, className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'focus-ring inline-flex select-none items-center justify-center font-semibold transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant], sizes[size], block && 'w-full', className,
      )}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

export function IconButton({
  className, children, label, ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        'focus-ring grid size-10 place-items-center rounded-xl text-muted transition hover:bg-black/5 active:scale-95 dark:hover:bg-white/5',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ------------------------------- Cards ----------------------------- */

export function Card({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('card p-5', className)} {...rest}>
      {children}
    </div>
  );
}

export function GlassCard({
  className, children, ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('glass rounded-[var(--radius-card)] p-5', className)} {...rest}>
      {children}
    </div>
  );
}

export function MotionCard({
  className, children, delay = 0,
}: { className?: string; children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn('card p-5', className)}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------- Pills/Chips ------------------------- */

export function Pill({
  active, className, children, ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        'focus-ring inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition active:scale-95',
        active
          ? 'bg-indigo text-white shadow-[0_8px_20px_-8px_rgba(79,70,229,0.7)]'
          : 'bg-black/5 text-muted hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full bg-lavender/15 px-2.5 py-1 text-xs font-medium text-indigo dark:text-lilac', className)}>
      {children}
    </span>
  );
}

/* ------------------------------- Misc ------------------------------ */

export function SectionHeader({
  title, subtitle, action, icon,
}: { title: string; subtitle?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          {icon}
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="rounded-2xl bg-black/[0.03] p-4 dark:bg-white/[0.04]">
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="mt-0.5 text-xs font-medium text-muted">{label}</div>
      {hint && <div className="mt-1 text-xs text-soft">{hint}</div>}
    </div>
  );
}

export function EmptyState({ emoji, title, hint }: { emoji: string; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[rgb(var(--border))] px-6 py-12 text-center">
      <div className="mb-3 text-4xl animate-breathe">{emoji}</div>
      <p className="font-medium">{title}</p>
      {hint && <p className="mt-1 max-w-xs text-sm text-muted">{hint}</p>}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn('h-px w-full bg-[rgb(var(--border))]/60', className)} />;
}
