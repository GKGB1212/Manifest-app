import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { useT } from '@/hooks/useT';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/primitives';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { BADGES, badgeName, badgeDesc } from '@/lib/data/badges';
import { levelProgress } from '@/lib/gamification';
import { cn } from '@/lib/utils';

export default function AchievementsPage() {
  const { t, lang } = useT();
  const data = useStore((s) => s.data);
  const lp = levelProgress(data.user.xp);
  const unlocked = BADGES.filter((b) => b.progress(data) >= 1).length;

  return (
    <div>
      <PageHeader title={t('ach.title')} subtitle={t('ach.subtitle')} />

      <Card className="mb-6 flex items-center gap-5">
        <ProgressRing value={lp.ratio} size={88} stroke={9} color="#7c6df2">
          <div className="text-center leading-none">
            <div className="text-2xl font-bold">{lp.level}</div>
            <div className="text-[0.6rem] text-soft">{t('common.level')}</div>
          </div>
        </ProgressRing>
        <div className="flex-1">
          <div className="flex items-baseline justify-between">
            <span className="font-semibold">{data.user.name}</span>
            <span className="text-sm text-muted">{unlocked}/{BADGES.length} {t('ach.unlocked')}</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
            <motion.div className="h-full rounded-full btn-grad" initial={{ width: 0 }} animate={{ width: `${Math.round(lp.ratio * 100)}%` }} transition={{ duration: 0.8 }} />
          </div>
          <div className="mt-1.5 text-xs text-soft">{lp.into} / {lp.need} {t('common.xp')}</div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {BADGES.map((b, i) => {
          const progress = Math.min(1, b.progress(data));
          const done = progress >= 1;
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.4) }}
              className={cn('card flex items-center gap-4 p-4', done && 'ring-1 ring-gold/40')}
            >
              <div className={cn('grid size-14 shrink-0 place-items-center rounded-2xl text-2xl transition', done ? 'bg-gradient-to-br from-amber-300 to-amber-500 shadow-[0_8px_20px_-8px_rgba(245,158,11,0.6)]' : 'bg-black/[0.05] grayscale dark:bg-white/[0.06]')}>
                {b.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{badgeName(b, lang)}</h3>
                  {done && <span className="text-xs font-semibold text-gold">✓ {t('ach.unlocked')}</span>}
                </div>
                <p className="text-sm text-muted">{badgeDesc(b, lang)}</p>
                {!done && (
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                    <div className="h-full rounded-full bg-lavender" style={{ width: `${Math.round(progress * 100)}%` }} />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
