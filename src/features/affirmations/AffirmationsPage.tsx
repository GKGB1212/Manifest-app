import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Play, Plus, Trash2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/hooks/useT';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, Pill, Chip, EmptyState, IconButton } from '@/components/ui/primitives';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Field';
import { CategoryPicker } from '@/components/CategoryPicker';
import { AFFIRMATION_LIBRARY, affirmationText } from '@/lib/data/affirmations';
import { categoryMeta, CATEGORIES } from '@/lib/data/categories';
import { AffirmationPractice } from './AffirmationPractice';
import type { LifeCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

type Tab = 'daily' | 'favorites' | 'mine';
interface Item { id: string | null; text: string; category: LifeCategory; reps: number; favorite: boolean; custom: boolean; }

export default function AffirmationsPage() {
  const { t, lang } = useT();
  const data = useStore((s) => s.data);
  const addAffirmation = useStore((s) => s.addAffirmation);
  const deleteAffirmation = useStore((s) => s.deleteAffirmation);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const favoriteSeed = useStore((s) => s.favoriteSeed);

  const [tab, setTab] = useState<Tab>('daily');
  const [cat, setCat] = useState<LifeCategory | 'all'>('all');
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState('');
  const [draftCat, setDraftCat] = useState<LifeCategory>('confidence');
  const [practice, setPractice] = useState<Item | null>(null);

  const repsByText = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of data.affirmations) m.set(a.text, a.repetitions);
    return m;
  }, [data.affirmations]);
  const favByText = useMemo(() => new Set(data.affirmations.filter((a) => a.isFavorite).map((a) => a.text)), [data.affirmations]);

  const items: Item[] = useMemo(() => {
    if (tab === 'mine') {
      return data.affirmations.filter((a) => a.isCustom).map((a) => ({ id: a.id, text: a.text, category: a.category, reps: a.repetitions, favorite: a.isFavorite, custom: true }));
    }
    if (tab === 'favorites') {
      return data.affirmations.filter((a) => a.isFavorite).map((a) => ({ id: a.id, text: a.text, category: a.category, reps: a.repetitions, favorite: true, custom: a.isCustom }));
    }
    return AFFIRMATION_LIBRARY.map((a) => ({
      id: null, text: affirmationText(a, lang), category: a.category,
      reps: repsByText.get(affirmationText(a, lang)) ?? 0, favorite: favByText.has(affirmationText(a, lang)), custom: false,
    }));
  }, [tab, data.affirmations, lang, repsByText, favByText]);

  const filtered = cat === 'all' ? items : items.filter((i) => i.category === cat);

  const create = () => {
    if (!draft.trim()) return;
    addAffirmation(draft, draftCat);
    setDraft(''); setCreating(false); setTab('mine');
  };

  return (
    <div>
      <PageHeader
        title={t('aff.title')}
        subtitle={t('aff.subtitle')}
        action={<Button size="sm" onClick={() => setCreating(true)}><Plus size={16} /> {t('aff.newAffirmation')}</Button>}
      />

      <div className="mb-4 flex gap-2">
        {(['daily', 'favorites', 'mine'] as Tab[]).map((tb) => (
          <Pill key={tb} active={tab === tb} onClick={() => setTab(tb)}>
            {tb === 'daily' ? t('aff.daily') : tb === 'favorites' ? t('aff.favorites') : t('aff.mine')}
          </Pill>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <Pill active={cat === 'all'} onClick={() => setCat('all')}>{t('common.all')}</Pill>
        {CATEGORIES.map((c) => (
          <Pill key={c.key} active={cat === c.key} onClick={() => setCat(c.key)}>
            <span>{c.emoji}</span> {t(c.tKey)}
          </Pill>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState emoji="📿" title={t('common.empty')} hint={t('aff.subtitle')} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((it, i) => {
            const meta = categoryMeta(it.category);
            return (
              <motion.div
                key={(it.id ?? it.text) + i}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3), ease: [0.22, 1, 0.36, 1] }}
                className="card relative flex flex-col gap-3 p-4"
              >
                <div className={cn('pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-[var(--radius-card)] bg-gradient-to-r', meta.gradient)} />
                <p className="font-display text-lg font-medium leading-snug">“{it.text}”</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Chip>{meta.emoji} {t(meta.tKey)}</Chip>
                    {it.reps > 0 && <span className="text-xs text-soft">{t('aff.totalReps', { n: it.reps })}</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <IconButton
                      label="Favorite"
                      onClick={() => (it.id ? toggleFavorite(it.id) : favoriteSeed(it.text, it.category))}
                    >
                      <Heart size={17} className={it.favorite ? 'fill-rose-400 text-rose-400' : ''} />
                    </IconButton>
                    {it.custom && it.id && (
                      <IconButton label="Delete" onClick={() => deleteAffirmation(it.id!)}><Trash2 size={16} /></IconButton>
                    )}
                    <Button size="sm" variant="soft" onClick={() => setPractice(it)}>
                      <Play size={15} /> {t('aff.repeat')}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* New affirmation modal */}
      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title={t('aff.newAffirmation')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreating(false)}>{t('common.cancel')}</Button>
            <Button onClick={create} disabled={!draft.trim()}>{t('common.save')}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Textarea rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={t('aff.placeholder')} autoFocus />
          <div>
            <p className="mb-2 text-sm font-medium text-muted">{t('nav.affirmations')}</p>
            <CategoryPicker value={draftCat} onChange={setDraftCat} />
          </div>
        </div>
      </Modal>

      <AffirmationPractice
        open={!!practice}
        onClose={() => setPractice(null)}
        affId={practice?.id ?? null}
        text={practice?.text ?? ''}
        category={practice?.category ?? 'confidence'}
      />
    </div>
  );
}
