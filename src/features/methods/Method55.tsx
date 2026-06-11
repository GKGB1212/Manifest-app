import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/hooks/useT';
import { useToast } from '@/components/ui/Toast';
import { Button, Card, EmptyState } from '@/components/ui/primitives';
import { Input } from '@/components/ui/Field';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { diffDays, dayKey } from '@/lib/utils';

export function Method55() {
  const { t, lang } = useT();
  const { toast } = useToast();
  const runs = useStore((s) => s.data.method55x5);
  const start55 = useStore((s) => s.start55);
  const log55 = useStore((s) => s.log55);

  const [intention, setIntention] = useState('');
  const [affirmation, setAffirmation] = useState('');
  const [box, setBox] = useState('');

  const active = runs.find((r) => !r.completed);

  const start = () => {
    if (!intention.trim() || !affirmation.trim()) return;
    start55(intention, affirmation);
    setIntention(''); setAffirmation('');
  };

  if (!active) {
    return (
      <div className="space-y-5">
        <Card>
          <p className="mb-4 text-sm text-muted">{t('m55.desc')}</p>
          <div className="space-y-3">
            <Input value={intention} onChange={(e) => setIntention(e.target.value)} placeholder={t('m369.intention')} />
            <Input value={affirmation} onChange={(e) => setAffirmation(e.target.value)} placeholder={t('m369.affirmation')} />
            <Button block onClick={start} disabled={!intention.trim() || !affirmation.trim()}>
              <Plus size={16} /> {t('m55.newRun')}
            </Button>
          </div>
        </Card>
        {runs.length === 0 && <EmptyState emoji="✍️" title={t('common.empty')} hint={t('m55.desc')} />}
        {runs.filter((r) => r.completed).map((r) => (
          <Card key={r.id} className="flex items-center justify-between">
            <span className="truncate text-sm text-muted">{r.intention}</span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-success"><Check size={15} /> {t('goals.achieved')}</span>
          </Card>
        ))}
      </div>
    );
  }

  // current day index = min(days since start, 4); but only advance once today's is done
  const elapsed = Math.min(4, Math.max(0, diffDays(dayKey(), dayKey(new Date(active.startedAt)))));
  // pick the first unfilled day up to elapsed
  let dayIndex = active.dayCounts.findIndex((c, i) => i <= elapsed && c < 55);
  if (dayIndex === -1) dayIndex = Math.min(elapsed, 4);
  const todayCount = active.dayCounts[dayIndex];

  const write = () => {
    const next = todayCount + 1;
    log55(active.id, dayIndex, next);
    setBox('');
    if ('vibrate' in navigator) navigator.vibrate?.(8);
    if (next >= 55) toast(t('common.greatJob'), '✨');
  };

  return (
    <div className="space-y-5">
      <Card>
        <div className="mb-1 text-sm font-semibold">{active.intention}</div>
        <p className="mb-4 font-display text-lg font-medium leading-snug">“{active.affirmation}”</p>

        <div className="mb-5 flex items-center justify-center gap-2">
          {active.dayCounts.map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`grid size-11 place-items-center rounded-2xl text-sm font-bold transition ${c >= 55 ? 'bg-success/90 text-white' : i === dayIndex ? 'bg-indigo text-white' : 'bg-black/[0.05] text-soft dark:bg-white/[0.06]'}`}>
                {c >= 55 ? <Check size={16} /> : c}
              </div>
              <span className="text-[0.6rem] text-soft">{t('common.day')} {i + 1}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          <ProgressRing value={todayCount / 55} size={96} stroke={9} color="#7c6df2">
            <div className="text-center leading-none">
              <div className="text-2xl font-bold tabular-nums">{todayCount}</div>
              <div className="text-[0.6rem] text-soft">/ 55</div>
            </div>
          </ProgressRing>
          <p className="text-sm font-medium text-muted">{t('m55.dayOf', { n: dayIndex + 1 })}</p>

          <input
            value={box}
            onChange={(e) => setBox(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && box.trim()) write(); }}
            placeholder={lang === 'vi' ? 'Gõ lại câu khẳng định rồi Enter…' : 'Type the affirmation, then Enter…'}
            className="w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))]/60 px-4 py-3 text-center outline-none transition placeholder:text-soft focus:border-lavender focus:ring-2 focus:ring-lavender/40"
            disabled={todayCount >= 55}
          />
          <Button variant="soft" onClick={write} disabled={todayCount >= 55}>
            <Plus size={15} /> {t('m55.count', { n: todayCount })}
          </Button>
        </div>
      </Card>
    </div>
  );
}
