import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flag, Sparkles, Eye, Trophy, Plus } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/hooks/useT';
import { formatDate } from '@/lib/utils';
import type { ManifestationGoal } from '@/lib/types';

interface Event { at: string; icon: typeof Flag; color: string; title: string; note?: string }

export function GoalTimeline({ goal }: { goal: ManifestationGoal }) {
  const { t, lang } = useT();
  const evidence = useStore((s) => s.data.evidence);
  const journal = useStore((s) => s.data.journal);

  const events: Event[] = useMemo(() => {
    const ev: Event[] = [];
    ev.push({ at: goal.createdAt, icon: Plus, color: '#7c6df2', title: t('goals.tl.created'), note: goal.title });
    for (const m of goal.milestones.filter((m) => m.done && m.doneAt)) {
      ev.push({ at: m.doneAt!, icon: Flag, color: '#22c55e', title: m.title });
    }
    for (const e of evidence.filter((e) => e.goalId === goal.id)) {
      ev.push({ at: e.createdAt, icon: Eye, color: '#fbbf24', title: t(`ev.${e.kind}` as 'ev.win'), note: e.note });
    }
    for (const j of journal.filter((j) => j.goalId === goal.id)) {
      ev.push({ at: j.createdAt, icon: Sparkles, color: '#a78bfa', title: t('nav.journal'), note: j.title });
    }
    if (goal.achievedAt) ev.push({ at: goal.achievedAt, icon: Trophy, color: '#f59e0b', title: t('goals.tl.achieved'), note: goal.desiredOutcome });
    return ev.sort((a, b) => +new Date(a.at) - +new Date(b.at));
  }, [goal, evidence, journal, t]);

  return (
    <div className="relative pl-2">
      <div className="absolute bottom-2 left-[1.05rem] top-2 w-px bg-gradient-to-b from-lavender/60 to-indigo/30" />
      <ul className="space-y-4">
        {events.map((e, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="relative flex gap-3"
          >
            <div className="z-10 grid size-7 shrink-0 place-items-center rounded-full text-white shadow" style={{ background: e.color }}>
              <e.icon size={14} />
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{e.title}</span>
                <span className="text-xs text-soft">{formatDate(e.at, lang)}</span>
              </div>
              {e.note && <p className="mt-0.5 text-sm text-muted">{e.note}</p>}
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
