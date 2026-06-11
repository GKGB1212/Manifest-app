import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Flower2, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/hooks/useT';
import { useToast } from '@/components/ui/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, Card, Stat } from '@/components/ui/primitives';
import { Textarea, ScaleSelector } from '@/components/ui/Field';
import { dayKey, formatDate, addDays } from '@/lib/utils';
import type { Scale5 } from '@/lib/types';

export default function GratitudePage() {
  const { t, lang } = useT();
  const { toast } = useToast();
  const entries = useStore((s) => s.data.gratitude);
  const saveGratitude = useStore((s) => s.saveGratitude);

  const today = dayKey();
  const todayEntry = entries.find((g) => g.day === today);
  const [items, setItems] = useState<string[]>(todayEntry?.items ?? ['', '', '']);
  const [mood, setMood] = useState<Scale5 | undefined>(todayEntry?.mood);

  const prompts = [t('grat.q1'), t('grat.q2'), t('grat.q3')];

  const streak = useMemo(() => {
    const set = new Set(entries.filter((g) => g.items.some(Boolean)).map((g) => g.day));
    let n = 0;
    let cursor = set.has(today) ? today : addDays(today, -1);
    while (set.has(cursor)) { n++; cursor = addDays(cursor, -1); }
    return n;
  }, [entries, today]);

  const totalItems = entries.reduce((s, g) => s + g.items.filter(Boolean).length, 0);
  const canSave = items.some((i) => i.trim());

  const save = () => {
    saveGratitude(items.map((i) => i.trim()), mood);
    toast(t('grat.savedToday'), '🌼');
  };

  const past = entries.filter((g) => g.day !== today).slice(0, 8);

  return (
    <div>
      <PageHeader title={t('grat.title')} subtitle={t('grat.subtitle')} />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label={t('common.streak', { n: streak })} value={`${streak}🔥`} />
        <Stat label={t('grat.entries', { n: totalItems })} value={totalItems} />
        <Stat label={t('common.day')} value={entries.length} />
      </div>

      <Card className="mb-6">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-indigo dark:text-lilac">
          <Flower2 size={16} /> {formatDate(new Date().toISOString(), lang)}
        </div>
        <div className="space-y-4">
          {prompts.map((p, i) => (
            <div key={i}>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                <span className="grid size-5 place-items-center rounded-full bg-lavender/20 text-[0.65rem] font-bold text-indigo dark:text-lilac">{i + 1}</span>
                {p}
              </label>
              <Textarea
                rows={2}
                value={items[i]}
                onChange={(e) => setItems((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder="…"
              />
            </div>
          ))}
          <div>
            <label className="mb-2 block text-sm font-medium text-muted">{t('dash.moodToday')}</label>
            <ScaleSelector value={mood} onChange={setMood} />
          </div>
          <Button block onClick={save} disabled={!canSave}>
            <Sparkles size={16} /> {todayEntry ? t('common.save') : t('common.done')}
          </Button>
        </div>
      </Card>

      {past.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted">{t('goals.timeline')}</h2>
          {past.map((g) => (
            <motion.div key={g.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-4">
              <div className="mb-2 text-xs font-semibold text-soft">{formatDate(g.createdAt, lang)}</div>
              <ul className="space-y-1.5">
                {g.items.filter(Boolean).map((it, i) => (
                  <li key={i} className="flex gap-2 text-sm"><span className="text-gold">🌼</span> {it}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
