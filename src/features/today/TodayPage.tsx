import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, ChevronRight, Sparkles, Plus, Target, Eye, Brain } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/hooks/useT';
import { dayKey, partOfDay } from '@/lib/utils';
import { DAILY_RINGS, levelProgress } from '@/lib/gamification';
import { affirmationOfDay, affirmationText } from '@/lib/data/affirmations';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { MotionCard, Stat } from '@/components/ui/primitives';
import { categoryMeta } from '@/lib/data/categories';

const greetKey = () => {
  const p = partOfDay();
  return p === 'morning' ? 'greet.morning' : p === 'afternoon' ? 'greet.afternoon' : p === 'evening' ? 'greet.evening' : 'greet.night';
};

export default function TodayPage() {
  const { t, lang } = useT();
  const data = useStore((s) => s.data);
  const today = dayKey();
  const doneToday = new Set(data.activity[today] ?? []);
  const ringsDone = DAILY_RINGS.filter((r) => doneToday.has(r.id)).length;
  const lp = levelProgress(data.user.xp);

  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const aotd = affirmationOfDay(dayIndex);
  const moodDoneToday = data.moods.some((m) => m.day === today);
  const recentEvidence = data.evidence.slice(0, 3);
  const activeGoals = data.goals.filter((g) => g.status === 'active').length;
  const sessions = data.visualizations.length;

  const dateLabel = new Date().toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <div className="space-y-5">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[var(--radius-card)] btn-grad p-6 text-white sm:p-8"
      >
        <div className="pointer-events-none absolute -right-8 -top-10 size-44 rounded-full bg-white/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 left-10 size-40 rounded-full bg-gold/30 blur-2xl" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-sm/none font-medium text-white/80">{dateLabel}</p>
            <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
              {t(greetKey())}{data.user.name ? `, ${data.user.name}` : ''}
            </h1>
            <p className="mt-1.5 max-w-sm text-sm text-white/85">{t('dash.keepGoing')}</p>
            {data.streak.current > 0 && (
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-sm font-semibold backdrop-blur">
                <Flame size={15} /> {t('common.streak', { n: data.streak.current })}
              </div>
            )}
          </div>
          <ProgressRing value={lp.ratio} size={84} stroke={8} color="#fff" trackOpacity={0.25}>
            <div className="text-center leading-none">
              <div className="text-lg font-bold">{lp.level}</div>
              <div className="text-[0.6rem] text-white/80">{t('common.level')}</div>
            </div>
          </ProgressRing>
        </div>
      </motion.div>

      {/* Practice rings */}
      <MotionCard delay={0.05}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">{t('dash.dailyPractice')}</h2>
          <span className="text-sm text-muted">{t('dash.completedOf', { done: ringsDone, total: DAILY_RINGS.length })}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {DAILY_RINGS.map((r) => {
            const done = doneToday.has(r.id);
            const to = r.id === 'affirmation' ? '/affirmations' : r.id === 'gratitude' ? '/gratitude' : r.id === 'mood' ? '/mood' : '/visualize';
            return (
              <Link key={r.id} to={to} className="focus-ring group flex flex-col items-center gap-2 rounded-2xl py-2 transition hover:bg-black/[0.03] dark:hover:bg-white/[0.04]">
                <ProgressRing value={done ? 1 : 0} size={60} stroke={6} color={done ? '#22c55e' : '#7c6df2'}>
                  <span className="text-xl">{r.emoji}</span>
                </ProgressRing>
                <span className="text-center text-[0.7rem] font-medium text-muted">{t(r.tKey)}</span>
              </Link>
            );
          })}
        </div>
      </MotionCard>

      {/* Affirmation of the day */}
      <MotionCard delay={0.1} className="relative overflow-hidden">
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${categoryMeta(aotd.category).gradient} opacity-[0.08]`} />
        <div className="relative">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo dark:text-lilac">
            <Sparkles size={16} /> {t('dash.affirmationOfDay')}
          </div>
          <p className="font-display text-xl font-semibold leading-snug sm:text-2xl">
            “{affirmationText(aotd, lang)}”
          </p>
          <Link to="/affirmations" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo dark:text-lilac">
            {t('aff.repeat')} <ChevronRight size={16} />
          </Link>
        </div>
      </MotionCard>

      {/* Mood CTA + stats */}
      <div className="grid gap-5 sm:grid-cols-2">
        <MotionCard delay={0.15}>
          <h2 className="font-semibold">{t('dash.moodToday')}</h2>
          <p className="mt-1 text-sm text-muted">{t('mood.subtitle')}</p>
          <Link
            to="/mood"
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-lavender/15 px-4 py-2.5 text-sm font-semibold text-indigo transition hover:bg-lavender/25 dark:text-lilac"
          >
            💜 {moodDoneToday ? t('common.completed') : t('dash.checkIn')} <ChevronRight size={15} />
          </Link>
        </MotionCard>

        <MotionCard delay={0.2}>
          <h2 className="mb-3 font-semibold">{t('dash.quickAdd')}</h2>
          <div className="grid grid-cols-3 gap-2">
            {[
              { to: '/goals', icon: Target, label: t('nav.goals') },
              { to: '/journal', icon: Plus, label: t('journal.new') },
              { to: '/visualize', icon: Brain, label: t('nav.visualize') },
            ].map((q) => (
              <Link key={q.to} to={q.to} className="focus-ring flex flex-col items-center gap-1.5 rounded-2xl bg-black/[0.03] py-3 text-xs font-medium text-muted transition hover:bg-black/[0.06] dark:bg-white/[0.04] dark:hover:bg-white/[0.07]">
                <q.icon size={18} className="text-indigo dark:text-lilac" />
                {q.label}
              </Link>
            ))}
          </div>
        </MotionCard>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label={t('dash.statGoals')} value={activeGoals} />
        <Stat label={t('dash.statEvidence')} value={data.evidence.length} />
        <Stat label={t('dash.statSessions')} value={sessions} />
      </div>

      {/* Recent evidence */}
      {recentEvidence.length > 0 && (
        <MotionCard delay={0.25}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold"><Eye size={17} /> {t('dash.recentEvidence')}</h2>
            <Link to="/goals" className="text-sm font-medium text-indigo dark:text-lilac">{t('common.viewAll')}</Link>
          </div>
          <ul className="space-y-2.5">
            {recentEvidence.map((e) => (
              <li key={e.id} className="flex items-start gap-3 rounded-2xl bg-black/[0.03] p-3 dark:bg-white/[0.04]">
                <span className="mt-0.5 text-lg">{e.kind === 'win' ? '🎉' : e.kind === 'synchronicity' ? '✨' : e.kind === 'opportunity' ? '🚪' : e.kind === 'sign' ? '🪧' : '📈'}</span>
                <p className="text-sm leading-snug">{e.note}</p>
              </li>
            ))}
          </ul>
        </MotionCard>
      )}
    </div>
  );
}
