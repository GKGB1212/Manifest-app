import { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, XAxis, Tooltip, AreaChart, Area, CartesianGrid, YAxis } from 'recharts';
import { TrendingUp, Flame, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/hooks/useT';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, Stat } from '@/components/ui/primitives';
import { lastNDays } from '@/lib/utils';

const PRACTICE_COLORS: Record<string, string> = {
  affirmation: '#7c6df2', gratitude: '#fbbf24', mood: '#a78bfa', visualization: '#34d399',
  journal: '#f472b6', method369: '#f97316', method55x5: '#fb923c', evidence: '#22d3ee',
  goal: '#6366f1', futureSelf: '#c4b5fd', vision: '#38bdf8',
};

export default function InsightsPage() {
  const { t, lang } = useT();
  const data = useStore((s) => s.data);

  const days30 = useMemo(() => lastNDays(30), []);
  const days14 = useMemo(() => lastNDays(14), []);

  const activityPerDay = days14.map((d) => ({ day: d.slice(5), count: (data.activity[d] ?? []).length }));

  const practiceMix = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const list of Object.values(data.activity)) for (const p of list) counts[p] = (counts[p] ?? 0) + 1;
    return Object.entries(counts).map(([k, v]) => ({ name: k, value: v, color: PRACTICE_COLORS[k] ?? '#a78bfa' }));
  }, [data.activity]);

  const moodByDay = new Map(data.moods.map((m) => [m.day, m]));
  const moodArea = lastNDays(30).map((d) => ({ day: d.slice(5), mood: moodByDay.get(d)?.mood ?? null, belief: moodByDay.get(d)?.selfBelief ?? null }));

  const totalPractices = Object.values(data.activity).reduce((s, a) => s + a.length, 0);
  const activeDays = Object.values(data.activity).filter((a) => a.length > 0).length;
  const consistency = days30.filter((d) => (data.activity[d] ?? []).length > 0).length;

  const practiceLabel = (k: string): string => {
    const map: Record<string, Parameters<typeof t>[0]> = {
      affirmation: 'nav.affirmations', gratitude: 'nav.gratitude', mood: 'nav.mood', visualization: 'nav.visualize',
      journal: 'nav.journal', method369: 'm369.title', method55x5: 'm55.title', evidence: 'goals.evidence',
      goal: 'nav.goals', futureSelf: 'nav.futureSelf', vision: 'nav.vision',
    };
    return map[k] ? t(map[k]) : k;
  };

  return (
    <div>
      <PageHeader title={t('analytics.title')} />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label={t('analytics.bestStreak')} value={`${data.streak.longest}🔥`} />
        <Stat label={t('analytics.totalPractices')} value={totalPractices} />
        <Stat label={t('common.level')} value={data.user.level} hint={`${data.user.xp} XP`} />
        <Stat label={t('analytics.consistency')} value={`${Math.round((consistency / 30) * 100)}%`} hint={`${activeDays} ${lang === 'vi' ? 'ngày' : 'days'}`} />
      </div>

      {/* 30-day heatmap */}
      <Card className="mb-5">
        <h2 className="mb-3 flex items-center gap-2 font-semibold"><Flame size={17} /> {t('analytics.activity')}</h2>
        <div className="flex flex-wrap gap-1.5">
          {days30.map((d) => {
            const n = (data.activity[d] ?? []).length;
            const intensity = n === 0 ? 0 : Math.min(1, n / 4);
            return (
              <div
                key={d}
                title={`${d}: ${n}`}
                className="size-6 rounded-md"
                style={{ background: n === 0 ? 'rgb(var(--ring-track))' : `rgba(124,109,242,${0.3 + intensity * 0.7})` }}
              />
            );
          })}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Consistency bars */}
        <Card>
          <h2 className="mb-4 flex items-center gap-2 font-semibold"><TrendingUp size={17} /> {t('analytics.consistency')}</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityPerDay} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'rgb(var(--text-soft))' }} tickLine={false} axisLine={false} interval={2} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: 'rgb(var(--text-soft))' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 14, border: '1px solid rgb(var(--border))', background: 'rgb(var(--surface))', fontSize: 12 }} cursor={{ fill: 'rgb(var(--ring-track))' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#7c6df2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Practice mix */}
        <Card>
          <h2 className="mb-4 flex items-center gap-2 font-semibold"><Sparkles size={17} /> {t('analytics.practiceMix')}</h2>
          {practiceMix.length === 0 ? (
            <p className="py-12 text-center text-sm text-soft">{t('common.empty')}</p>
          ) : (
            <div className="flex items-center gap-4">
              <div className="h-44 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={practiceMix} dataKey="value" nameKey="name" innerRadius={38} outerRadius={64} paddingAngle={3}>
                      {practiceMix.map((p) => <Cell key={p.name} fill={p.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 14, border: '1px solid rgb(var(--border))', background: 'rgb(var(--surface))', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="space-y-1.5 text-xs">
                {practiceMix.sort((a, b) => b.value - a.value).slice(0, 6).map((p) => (
                  <li key={p.name} className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ background: p.color }} />
                    <span className="text-muted">{practiceLabel(p.name)}</span>
                    <span className="font-semibold">{p.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>

      {/* Mood area */}
      {data.moods.length >= 2 && (
        <Card className="mt-5">
          <h2 className="mb-4 font-semibold">{t('analytics.moodTrend')}</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodArea} margin={{ top: 4, right: 6, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c6df2" stopOpacity={0.4} /><stop offset="100%" stopColor="#7c6df2" stopOpacity={0} /></linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fbbf24" stopOpacity={0.35} /><stop offset="100%" stopColor="#fbbf24" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'rgb(var(--text-soft))' }} tickLine={false} axisLine={false} interval={4} />
                <YAxis domain={[0, 5]} ticks={[1, 3, 5]} tick={{ fontSize: 10, fill: 'rgb(var(--text-soft))' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 14, border: '1px solid rgb(var(--border))', background: 'rgb(var(--surface))', fontSize: 12 }} />
                <Area type="monotone" dataKey="mood" stroke="#7c6df2" strokeWidth={2.5} fill="url(#g1)" connectNulls name={t('mood.mood')} />
                <Area type="monotone" dataKey="belief" stroke="#fbbf24" strokeWidth={2.5} fill="url(#g2)" connectNulls name={t('mood.selfBelief')} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
