import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Sparkles, Trash2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/hooks/useT';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, Pill, Chip, EmptyState, IconButton } from '@/components/ui/primitives';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea, Segmented, ScaleSelector } from '@/components/ui/Field';
import { emotionTags, scriptingTemplates, randomScriptingPrompt } from '@/lib/data/content';
import { formatRelative, cn } from '@/lib/utils';
import type { JournalKind, Scale5 } from '@/lib/types';

const KIND_EMOJI: Record<JournalKind, string> = { scripting: '🎬', free: '📝', reflection: '🪞' };

export default function JournalPage() {
  const { t, lang } = useT();
  const entries = useStore((s) => s.data.journal);
  const goals = useStore((s) => s.data.goals);
  const addJournal = useStore((s) => s.addJournal);
  const deleteJournal = useStore((s) => s.deleteJournal);

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<JournalKind | 'all'>('all');

  const [kind, setKind] = useState<JournalKind>('scripting');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [emotions, setEmotions] = useState<string[]>([]);
  const [mood, setMood] = useState<Scale5 | undefined>();
  const [goalId, setGoalId] = useState<string>('');

  const tags = emotionTags(lang);

  const filtered = useMemo(() => {
    return entries
      .filter((e) => (filter === 'all' ? true : e.kind === filter))
      .filter((e) => (q ? (e.title + e.body).toLowerCase().includes(q.toLowerCase()) : true));
  }, [entries, filter, q]);

  const reset = () => { setTitle(''); setBody(''); setEmotions([]); setMood(undefined); setGoalId(''); setKind('scripting'); };
  const save = () => {
    if (!body.trim() && !title.trim()) return;
    addJournal({ kind, title: title.trim() || (lang === 'vi' ? 'Không tiêu đề' : 'Untitled'), body, emotions, mood, goalId: goalId || undefined, tags: [] });
    reset(); setOpen(false);
  };
  const applyTemplate = (tpl: { title: string; body: string }) => { setTitle(tpl.title); setBody(tpl.body); setKind('scripting'); };

  return (
    <div>
      <PageHeader
        title={t('journal.title')}
        subtitle={t('journal.scriptingHint')}
        action={<Button size="sm" onClick={() => { reset(); setOpen(true); }}><Plus size={16} /> {t('journal.new')}</Button>}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-soft" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('common.search')} className="pl-9" />
        </div>
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        <Pill active={filter === 'all'} onClick={() => setFilter('all')}>{t('common.all')}</Pill>
        {(['scripting', 'free', 'reflection'] as JournalKind[]).map((k) => (
          <Pill key={k} active={filter === k} onClick={() => setFilter(k)}>
            {KIND_EMOJI[k]} {k === 'scripting' ? t('journal.scripting') : k === 'free' ? t('nav.journal') : t('nav.groups.reflect')}
          </Pill>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState emoji="🎬" title={t('common.empty')} hint={t('journal.scriptingHint')} />
      ) : (
        <div className="space-y-3">
          {filtered.map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.25) }} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span>{KIND_EMOJI[e.kind]}</span>
                    <h3 className="truncate font-semibold">{e.title}</h3>
                  </div>
                  <p className="mt-1.5 line-clamp-3 whitespace-pre-wrap text-sm text-muted">{e.body}</p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-soft">{formatRelative(e.createdAt, lang)}</span>
                    {e.emotions.map((em) => <Chip key={em}>{em}</Chip>)}
                  </div>
                </div>
                <IconButton label="Delete" onClick={() => deleteJournal(e.id)}><Trash2 size={16} /></IconButton>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t('journal.new')}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={save} disabled={!body.trim() && !title.trim()}>{t('common.save')}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Segmented
            value={kind}
            onChange={setKind}
            options={[
              { value: 'scripting', label: `🎬 ${t('journal.scripting')}` },
              { value: 'free', label: `📝 ${t('nav.journal')}` },
              { value: 'reflection', label: `🪞 ${t('nav.groups.reflect')}` },
            ]}
          />

          {kind === 'scripting' && (
            <div className="flex flex-wrap gap-2">
              {scriptingTemplates(lang).map((tpl) => (
                <button key={tpl.id} onClick={() => applyTemplate(tpl)} className="focus-ring rounded-full bg-lavender/15 px-3 py-1.5 text-xs font-medium text-indigo transition hover:bg-lavender/25 dark:text-lilac">
                  {tpl.title}
                </button>
              ))}
            </div>
          )}

          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('journal.titlePlaceholder')} />
          <div className="relative">
            <Textarea rows={7} value={body} onChange={(e) => setBody(e.target.value)} placeholder={t('journal.bodyPlaceholder')} />
            <button
              onClick={() => setBody((b) => (b ? b + '\n\n' : '') + randomScriptingPrompt(lang) + '\n')}
              className="focus-ring absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-indigo/90 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
            >
              <Sparkles size={13} /> {t('journal.suggest')}
            </button>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-muted">{t('journal.emotions')}</label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((em) => {
                const active = emotions.includes(em);
                return (
                  <button
                    key={em}
                    onClick={() => setEmotions((e) => (active ? e.filter((x) => x !== em) : [...e, em]))}
                    className={cn('focus-ring rounded-full px-3 py-1.5 text-xs font-medium transition', active ? 'bg-indigo text-white' : 'bg-black/5 text-muted dark:bg-white/5')}
                  >
                    {em}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-muted">{t('dash.moodToday')}</label>
              <ScaleSelector value={mood} onChange={setMood} />
            </div>
            {goals.length > 0 && (
              <div>
                <label className="mb-2 block text-sm font-medium text-muted">{t('nav.goals')} <span className="text-soft">· {t('common.optional')}</span></label>
                <select
                  aria-label={t('nav.goals')}
                  value={goalId}
                  onChange={(e) => setGoalId(e.target.value)}
                  className="w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))]/60 px-3 py-3 text-sm outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/40"
                >
                  <option value="">—</option>
                  {goals.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
