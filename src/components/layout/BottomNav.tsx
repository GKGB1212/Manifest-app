import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';
import { NAV, MOBILE_PRIMARY, NAV_GROUPS } from './nav';
import { Modal } from '@/components/ui/Modal';
import { useT } from '@/hooks/useT';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const { t } = useT();
  const [moreOpen, setMoreOpen] = useState(false);
  const primary = MOBILE_PRIMARY.map((to) => NAV.find((n) => n.to === to)!);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-30 lg:hidden">
        <div className="glass mx-3 mb-3 flex items-center justify-around rounded-3xl px-1.5 py-1.5">
          {primary.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                cn(
                  'focus-ring relative flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 text-[0.62rem] font-medium transition',
                  isActive ? 'text-indigo dark:text-lilac' : 'text-soft',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span layoutId="tab-dot" className="absolute -top-0.5 size-1.5 rounded-full bg-indigo dark:bg-lilac" />
                  )}
                  <n.icon size={20} />
                  <span>{t(n.tKey)}</span>
                </>
              )}
            </NavLink>
          ))}
          <button
            onClick={() => setMoreOpen(true)}
            className="focus-ring flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 text-[0.62rem] font-medium text-soft"
          >
            <LayoutGrid size={20} />
            <span>{t('common.all')}</span>
          </button>
        </div>
      </nav>

      <Modal open={moreOpen} onClose={() => setMoreOpen(false)} title={t('appName')}>
        <div className="space-y-5 pb-2">
          {NAV_GROUPS.map((g) => (
            <div key={g.id}>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-soft">{t(g.tKey)}</div>
              <div className="grid grid-cols-3 gap-2.5">
                {NAV.filter((n) => n.group === g.id).map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    onClick={() => setMoreOpen(false)}
                    className="focus-ring flex flex-col items-center gap-1.5 rounded-2xl bg-black/[0.03] py-3.5 text-xs font-medium dark:bg-white/[0.04]"
                  >
                    <n.icon size={20} className="text-indigo dark:text-lilac" />
                    {t(n.tKey)}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
          <NavLink
            to="/settings"
            onClick={() => setMoreOpen(false)}
            className="focus-ring flex items-center gap-2 rounded-2xl bg-black/[0.03] px-4 py-3 text-sm font-medium dark:bg-white/[0.04]"
          >
            {(() => { const S = NAV[NAV.length - 1].icon; return <S size={18} />; })()}
            {t('nav.settings')}
          </NavLink>
        </div>
      </Modal>
    </>
  );
}
