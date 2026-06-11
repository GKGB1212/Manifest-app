import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Trophy, Eye, Flag, Trash2, Calendar, Flame } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/hooks/useT';
import { useToast } from '@/components/ui/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, Pill, Chip, EmptyState, IconButton, Divider } from '@/components/ui/primitives';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea, ScaleSelector } from '@/components/ui/Field';
import { CategoryPicker } from '@/components/CategoryPicker';
import { GoalTimeline } from './GoalTimeline';
import { categoryMeta } from '@/lib/data/categories';
import { formatDate, pct, cn } from '@/lib/utils';
import type { LifeCategory, Scale5, EvidenceKind } from '@/lib/types';

const EVIDENCE_KINDS: { key: EvidenceKind; emoji: string }[] = [
  { key: 'sign', emoji: '🪧' }, { key: 'synchronicity', emoji: '✨' },
  { key: 'win', emoji: '🎉' }, { key: 'opportunity', emoji: '🚪' }, { key: 'progress', emoji: '📈' },
];

export default function GoalsPage() {
  const { t, lang } = useT();
  const { toast } = useToast();
  const goals = useStore((s) => s.data.goals);
  const evidence = useStore((s) => s.data.evidence);
  const addGoal = useStore((s) => s.addGoal);
  const deleteGoal = useStore((s) => s.deleteGoal);
  const toggleMilestone = useStore((s) => s.toggleMilestone);
  const achieveGoal = useStore((s) => s.achieveGoal);
  const addEvidence = useStore((s) => s.addEvidence);

  const [filter, setFilter] = useState<'active' | 'achieved'>('active');
  const [creating, setCreating] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  // new-goal form
  const [f, setF] = useState({ title: '', category: 'career' as LifeCategory, description: '', desiredOutcome: '', targetDate: '', importance: 4 as Scale5, emotionalIntensity: 4 as Scale5, milestones: '' });

  // evidence form (within detail)
  const [evKind, setEvKind] = useState<EvidenceKind>('win');
  const [evNote, setEvNote] = useState('');
  const [evCharge, setEvCharge] = useState<Scale5>(4);

  const filtered = goals.filter((g) => (filter === 'achieved' ? g.status === 'achieved' : g.status === 'active'));
  const detail = goals.find((g) => g.id === detailId);

  const create = () => {
    if (!f.title.trim()) return;
    addGoal({
      title: f.title.trim(), category: f.category, description: f.description,
      desiredOutcome: f.desiredOutcome, targetDate: f.targetDate || undefined,
      importance: f.importance, emotionalIntensity: f.emotionalIntensity,
      milestones: f.milestones.split('\n').map((s) => s.trim()).filter(Boolean),
    });
    setF({ title: '', category: 'career', description: '', desiredOutcome: '', targetDate: '', importance: 4, emotionalIntensity: 4, milestones: '' });
    setCreating(false);
  };

  const saveEvidence = () => {
    if (!evNote.trim() || !detail) return;
    addEvidence({ goalId: detail.id, kind: evKind, note: evNote.trim(), emotionalCharge: evCharge });
    setEvNote('');
    toast(t('common.greatJob'), '✨');
  };

  return (
    <div>
      <PageHeader
        title={t('goals.title')}
        action={<Button size="sm" onClick={() => setCreating(true)}><Plus size={16} /> {t('goals.new')}</Button>}
      />

      <div className="mb-5 flex gap-2">
        <Pill active={filter === 'active'} onClick={() => setFilter('active')}><Target size={14} /> {t('common.all')}</Pill>
        <Pill active={filter === 'achieved'} onClick={() => setFilter('achieved')}><Trophy size={14} /> {t('goals.achieved')}</Pill>
      </div>

      {filtered.length === 0 ? (
        <EmptyState emoji="🎯" title={t('common.empty')} hint={t('goals.desiredOutcome')} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((g) => {
            const meta = categoryMeta(g.category);
            const evCount = evidence.filter((e) => e.goalId === g.id).length;
            const mDone = g.milestones.filter((m) => m.done).length;
            const mPct = pct(mDone, g.milestones.length || 1);
            return (
              <motion.div key={g.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card relative overflow-hidden p-5">
                <div className={cn('pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r', meta.gradient)} />
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg font-semibold">{g.title}</h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <Chip>{meta.emoji} {t(meta.tKey)}</Chip>
                      {g.status === 'achieved' && <Chip className="bg-success/15 text-success">🏆 {t('goals.achieved')}</Chip>}
                    </div>
                  </div>
                  <IconButton label="Delete" onClick={() => deleteGoal(g.id)}><Trash2 size={15} /></IconButton>
                </div>

                {g.desiredOutcome && <p className="mt-3 text-sm text-muted">{g.desiredOutcome}</p>}

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-soft">
                  {g.targetDate && <span className="inline-flex items-center gap-1"><Calendar size={12} /> {formatDate(g.targetDate, lang)}</span>}
                  <span className="inline-flex items-center gap-1"><Flame size={12} /> {g.emotionalIntensity}/5</span>
                  <span className="inline-flex items-center gap-1"><Eye size={12} /> {evCount} {t('goals.evidence')}</span>
                </div>

                {g.milestones.length > 0 && (
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs text-soft"><span>{t('goals.milestones')}</span><span>{mDone}/{g.milestones.length}</span></div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                      <div className="h-full rounded-full btn-grad" style={{ width: `${mPct}%` }} />
                    </div>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="soft" onClick={() => setDetailId(g.id)}><Flag size={14} /> {t('goals.timeline')}</Button>
                  {g.status !== 'achieved' && (
                    <Button size="sm" variant="ghost" onClick={() => { achieveGoal(g.id); toast(t('goals.tl.achieved'), '🏆'); }}>
                      <Trophy size={14} /> {t('goals.markAchieved')}
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* New goal */}
      <Modal
        open={creating} onClose={() => setCreating(false)} title={t('goals.new')} size="lg"
        footer={<><Button variant="ghost" onClick={() => setCreating(false)}>{t('common.cancel')}</Button><Button onClick={create} disabled={!f.title.trim()}>{t('common.save')}</Button></>}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted">{t('goals.title')}</label>
            <Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} autoFocus placeholder={lang === 'vi' ? 'Mục tiêu của tôi…' : 'My goal…'} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-muted">{t('nav.affirmations')}</label>
            <CategoryPicker value={f.category} onChange={(c) => setF({ ...f, category: c })} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted">{t('goals.desiredOutcome')}</label>
            <Textarea rows={2} value={f.desiredOutcome} onChange={(e) => setF({ ...f, desiredOutcome: e.target.value })} placeholder={lang === 'vi' ? 'Tôi sẽ cảm thấy…' : 'I will feel…'} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">{t('goals.targetDate')} <span className="text-soft">· {t('common.optional')}</span></label>
              <Input type="date" value={f.targetDate} onChange={(e) => setF({ ...f, targetDate: e.target.value })} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-muted">{t('goals.importance')}</label>
              <ScaleSelector value={f.importance} onChange={(v) => setF({ ...f, importance: v })} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted">{t('goals.emotion')}</label>
              <ScaleSelector value={f.emotionalIntensity} onChange={(v) => setF({ ...f, emotionalIntensity: v })} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted">{t('goals.milestones')} <span className="text-soft">· {lang === 'vi' ? 'mỗi dòng một mục' : 'one per line'}</span></label>
            <Textarea rows={3} value={f.milestones} onChange={(e) => setF({ ...f, milestones: e.target.value })} />
          </div>
        </div>
      </Modal>

      {/* Detail / timeline */}
      <Modal open={!!detail} onClose={() => setDetailId(null)} title={detail?.title} size="lg">
        {detail && (
          <div className="space-y-5">
            {detail.description && <p className="text-sm text-muted">{detail.description}</p>}

            {detail.milestones.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold">{t('goals.milestones')}</h4>
                <ul className="space-y-1.5">
                  {detail.milestones.map((m) => (
                    <li key={m.id}>
                      <button onClick={() => toggleMilestone(detail.id, m.id)} className="focus-ring flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-left text-sm transition hover:bg-black/[0.03] dark:hover:bg-white/[0.04]">
                        <span className={cn('grid size-5 shrink-0 place-items-center rounded-md border', m.done ? 'border-success bg-success text-white' : 'border-[rgb(var(--border))]')}>
                          {m.done && '✓'}
                        </span>
                        <span className={m.done ? 'text-soft line-through' : ''}>{m.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Divider />

            <div>
              <h4 className="mb-2 text-sm font-semibold">{t('goals.addEvidence')}</h4>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {EVIDENCE_KINDS.map((k) => (
                  <Pill key={k.key} active={evKind === k.key} onClick={() => setEvKind(k.key)}>{k.emoji} {t(`ev.${k.key}` as 'ev.win')}</Pill>
                ))}
              </div>
              <Textarea rows={2} value={evNote} onChange={(e) => setEvNote(e.target.value)} placeholder={t('goals.evidencePlaceholder')} />
              <div className="mt-2 flex items-end justify-between gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-soft">{t('goals.emotion')}</label>
                  <ScaleSelector value={evCharge} onChange={setEvCharge} />
                </div>
                <Button onClick={saveEvidence} disabled={!evNote.trim()}><Plus size={15} /> {t('common.add')}</Button>
              </div>
            </div>

            <Divider />

            <div>
              <h4 className="mb-3 text-sm font-semibold">{t('goals.timeline')}</h4>
              <GoalTimeline goal={detail} />
            </div>

            {detail.status !== 'achieved' && (
              <Button block variant="success" onClick={() => { achieveGoal(detail.id); toast(t('goals.tl.achieved'), '🏆'); setDetailId(null); }}>
                <Trophy size={16} /> {t('goals.markAchieved')}
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
