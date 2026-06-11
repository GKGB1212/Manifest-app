import { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useStore } from '@/lib/store';
import { useT } from '@/hooks/useT';
import { useToast } from '@/components/ui/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, Card } from '@/components/ui/primitives';
import { Textarea, ScaleSelector } from '@/components/ui/Field';
import { dayKey, lastNDays } from '@/lib/utils';
import type { Scale5 } from '@/lib/types';
import type { TKey } from '@/lib/i18n';

const FIELDS: { key: 'mood' | 'energy' | 'confidence' | 'stress' | 'gratitude' | 'selfBelief'; tKey: TKey; emoji: string }[] = [
  { key: 'mood', tKey: 'mood.mood', emoji: '🙂' },
  { key: 'energy', tKey: 'mood.energy', emoji: '⚡' },
  { key: 'confidence', tKey: 'mood.confidence', emoji: '💪' },
  { key: 'gratitude', tKey: 'mood.gratitude', emoji: '🌼' },
  { key: 'selfBelief', tKey: 'mood.selfBelief', emoji: '✨' },
  { key: 'stress', tKey: 'mood.stress', emoji: '🌊' },
];

export default function MoodPage() {
  const { t, lang } = useT();
  const { toast } = useToast();
  const moods = useStore((s) => s.data.moods);
  const addMood = useStore((s) => s.addMood);

  const today = dayKey();
  const todayMood = moods.find((m) => m.day === today);
  const [vals, setVals] = useState<Record<string, Scale5>>({
    mood: todayMood?.mood ?? 3, energy: todayMood?.energy ?? 3, confidence: todayMood?.confidence ?? 3,
    stress: todayMood?.stress ?? 2, gratitude: todayMood?.gratitude ?? 3, selfBelief: todayMood?.selfBelief ?? 3,
  });
  const [note, setNote] = useState(todayMood?.note ?? '');

  const save = () => {
    addMood({ mood: vals.mood, energy: vals.energy, confidence: vals.confidence, stress: vals.stress, gratitude: vals.gratitude, selfBelief: vals.selfBelief, note });
    toast(t('mood.saved'), '💜');
  };

  const days = lastNDays(14);
  const byDay = new Map(moods.map((m) => [m.day, m]));
  const chartData = days.map((d) => {
    const m = byDay.get(d);
    return {
      day: d.slice(5),
      [t('mood.mood')]: m?.mood ?? null,
      [t('mood.selfBelief')]: m?.selfBelief ?? null,
      [t('mood.energy')]: m?.energy ?? null,
    };
  });

  const lowLabel = lang === 'vi' ? 'thấp' : 'low';
  const highLabel = lang === 'vi' ? 'cao' : 'high';

  return (
    <div>
      <PageHeader title={t('mood.title')} subtitle={t('mood.subtitle')} />

      <Card className="mb-6">
        <div className="space-y-5">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <span>{f.emoji}</span> {t(f.tKey)}
              </label>
              <ScaleSelector
                value={vals[f.key]}
                onChange={(v) => setVals((s) => ({ ...s, [f.key]: v }))}
                lowLabel={lowLabel}
                highLabel={highLabel}
              />
            </div>
          ))}
          <div>
            <label className="mb-2 block text-sm font-medium text-muted">{t('mood.note')}</label>
            <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <Button block onClick={save}>💜 {todayMood ? t('common.save') : t('dash.checkIn')}</Button>
        </div>
      </Card>

      {moods.length >= 2 && (
        <Card>
          <h2 className="mb-4 font-semibold">{t('mood.trends')}</h2>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'rgb(var(--text-soft))' }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 5]} ticks={[1, 3, 5]} tick={{ fontSize: 11, fill: 'rgb(var(--text-soft))' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid rgb(var(--border))', background: 'rgb(var(--surface))', fontSize: 12 }} />
                <Line type="monotone" dataKey={t('mood.mood')} stroke="#7c6df2" strokeWidth={2.5} dot={false} connectNulls />
                <Line type="monotone" dataKey={t('mood.selfBelief')} stroke="#fbbf24" strokeWidth={2.5} dot={false} connectNulls />
                <Line type="monotone" dataKey={t('mood.energy')} stroke="#34d399" strokeWidth={2.5} dot={false} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#7c6df2]" /> {t('mood.mood')}</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-gold" /> {t('mood.selfBelief')}</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#34d399]" /> {t('mood.energy')}</span>
          </div>
        </Card>
      )}
    </div>
  );
}
