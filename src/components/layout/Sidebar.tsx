import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { NAV, NAV_GROUPS } from './nav';
import { useT } from '@/hooks/useT';
import { useStore } from '@/lib/store';
import { levelProgress } from '@/lib/gamification';
import { cn } from '@/lib/utils';

function Row({ to, label, icon: Icon }: { to: string; label: string; icon: React.ComponentType<{ size?: number }> }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        cn(
          'focus-ring group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
          isActive ? 'text-indigo dark:text-lilac' : 'text-muted hover:text-[rgb(var(--text))]',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute inset-0 -z-10 rounded-xl bg-lavender/15"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
          <Icon size={18} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  const { t } = useT();
  const user = useStore((s) => s.data.user);
  const streak = useStore((s) => s.data.streak);
  const lp = levelProgress(user.xp);

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-1 overflow-y-auto scroll-thin border-r border-[rgb(var(--border))]/60 px-4 py-6 lg:flex">
      <div className="mb-5 flex items-center gap-2.5 px-2">
        <div className="grid size-9 place-items-center rounded-2xl btn-grad text-lg">🌙</div>
        <div>
          <div className="font-display text-lg font-semibold leading-none">{t('appName')}</div>
          <div className="text-xs text-soft">{t('tagline')}</div>
        </div>
      </div>

      <Row to="/" label={t('nav.today')} icon={NAV[0].icon} />

      {NAV_GROUPS.map((g) => (
        <div key={g.id} className="mt-4">
          <div className="px-3 pb-1 text-[0.68rem] font-semibold uppercase tracking-wider text-soft">
            {t(g.tKey)}
          </div>
          {NAV.filter((n) => n.group === g.id).map((n) => (
            <Row key={n.to} to={n.to} label={t(n.tKey)} icon={n.icon} />
          ))}
        </div>
      ))}

      <div className="mt-4">
        <Row to="/settings" label={t('nav.settings')} icon={NAV[NAV.length - 1].icon} />
      </div>

      <div className="mt-auto rounded-2xl bg-black/[0.03] p-3.5 dark:bg-white/[0.04]">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">{t('common.level')} {lp.level}</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
            <Flame size={13} /> {streak.current}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <motion.div
            className="h-full rounded-full btn-grad"
            initial={{ width: 0 }}
            animate={{ width: `${Math.round(lp.ratio * 100)}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="mt-1.5 text-xs text-soft">{lp.into} / {lp.need} {t('common.xp')}</div>
      </div>
    </aside>
  );
}
