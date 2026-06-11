import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Sun, Moon, Check } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/hooks/useT';
import { useToast } from '@/components/ui/Toast';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Input } from '@/components/ui/Field';
import { Card } from '@/components/ui/primitives';
import { dayKey, formatDate } from '@/lib/utils';
import type { Phase369 } from '@/lib/types';

const PHASES: { key: Phase369; target: number; tKey: 'm369.morning' | 'm369.afternoon' | 'm369.night'; icon: typeof Sun; color: string }[] = [
  { key: 'morning', target: 3, tKey: 'm369.morning', icon: Sunrise, color: '#fbbf24' },
  { key: 'afternoon', target: 6, tKey: 'm369.afternoon', icon: Sun, color: '#f97316' },
  { key: 'night', target: 9, tKey: 'm369.night', icon: Moon, color: '#7c6df2' },
];

export function Method369() {
  const { t, lang } = useT();
  const { toast } = useToast();
  const sessions = useStore((s) => s.data.method369);
  const ensure369 = useStore((s) => s.ensure369);
  const set369Meta = useStore((s) => s.set369Meta);
  const inc369 = useStore((s) => s.inc369);

  const today = dayKey();
  const todaySession = sessions.find((m) => m.day === today);
  const [intention, setIntention] = useState(todaySession?.intention ?? '');
  const [affirmation, setAffirmation] = useState(todaySession?.affirmation ?? '');
  const [writeBox, setWriteBox] = useState<Record<Phase369, string>>({ morning: '', afternoon: '', night: '' });

  const history = useMemo(() => sessions.filter((m) => m.day !== today).slice(0, 6), [sessions, today]);
  const ready = intention.trim() && affirmation.trim();

  const ensureMeta = () => {
    ensure369(intention, affirmation);
    set369Meta(intention, affirmation);
  };

  const handleWrite = (phase: Phase369) => {
    if (!ready) return;
    ensureMeta();
    inc369(phase);
    setWriteBox((w) => ({ ...w, [phase]: '' }));
    const sess = useStore.getState().data.method369.find((m) => m.day === today);
    if (sess?.completed) toast(t('m369.allDone'), '🌙');
  };

  return (
    <div className="space-y-5">
      <Card>
        <p className="mb-4 text-sm text-muted">{t('m369.desc')}</p>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted">{t('m369.intention')}</label>
            <Input value={intention} onChange={(e) => setIntention(e.target.value)} onBlur={ensureMeta} placeholder={lang === 'vi' ? 'Tôi muốn…' : 'I want…'} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted">{t('m369.affirmation')}</label>
            <Input value={affirmation} onChange={(e) => setAffirmation(e.target.value)} onBlur={ensureMeta} placeholder={t('aff.placeholder')} />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {PHASES.map((p) => {
          const done = todaySession?.progress[p.key] ?? 0;
          const complete = done >= p.target;
          return (
            <motion.div key={p.key} layout className="card flex flex-col items-center gap-3 p-5 text-center">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <p.icon size={16} style={{ color: p.color }} /> {t(p.tKey)}
              </div>
              <ProgressRing value={p.target ? done / p.target : 0} size={86} stroke={8} color={p.color}>
                <div className="text-center leading-none">
                  <div className="text-xl font-bold tabular-nums">{done}</div>
                  <div className="text-[0.6rem] text-soft">/ {p.target}</div>
                </div>
              </ProgressRing>
              {complete ? (
                <div className="inline-flex items-center gap-1 text-sm font-semibold text-success"><Check size={15} /> {t('common.completed')}</div>
              ) : (
                <input
                  value={writeBox[p.key]}
                  disabled={!ready}
                  onChange={(e) => setWriteBox((w) => ({ ...w, [p.key]: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter' && writeBox[p.key].trim()) handleWrite(p.key); }}
                  placeholder={t('m369.writeHere')}
                  className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))]/60 px-3 py-2 text-center text-sm outline-none transition placeholder:text-soft focus:border-lavender focus:ring-2 focus:ring-lavender/40 disabled:opacity-50"
                />
              )}
              {!complete && (
                <button
                  onClick={() => handleWrite(p.key)}
                  disabled={!ready}
                  className="focus-ring text-xs font-semibold text-indigo disabled:opacity-40 dark:text-lilac"
                >
                  + {t('common.add')} ({done}/{p.target})
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {history.length > 0 && (
        <Card>
          <h3 className="mb-3 text-sm font-semibold">{t('goals.timeline')}</h3>
          <ul className="space-y-2">
            {history.map((h) => {
              const total = h.progress.morning + h.progress.afternoon + h.progress.night;
              return (
                <li key={h.id} className="flex items-center justify-between rounded-xl bg-black/[0.03] px-3.5 py-2.5 text-sm dark:bg-white/[0.04]">
                  <span className="truncate text-muted">{formatDate(h.createdAt, lang)} · {h.intention || '—'}</span>
                  <span className={h.completed ? 'font-semibold text-success' : 'text-soft'}>{h.completed ? '✓' : `${total}/18`}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
