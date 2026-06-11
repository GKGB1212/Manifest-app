import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ImagePlus, Trash2, ArrowLeft, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/hooks/useT';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, Pill, Chip, EmptyState, IconButton } from '@/components/ui/primitives';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Field';
import { CategoryPicker } from '@/components/CategoryPicker';
import { categoryMeta, CATEGORIES } from '@/lib/data/categories';
import { readFileAsDataURL, clamp } from '@/lib/utils';
import type { LifeCategory } from '@/lib/types';

export default function VisionPage() {
  const { t, lang } = useT();
  const boards = useStore((s) => s.data.visionBoards);
  const addBoard = useStore((s) => s.addBoard);
  const deleteBoard = useStore((s) => s.deleteBoard);
  const addVisionItem = useStore((s) => s.addVisionItem);
  const moveVisionItem = useStore((s) => s.moveVisionItem);
  const deleteVisionItem = useStore((s) => s.deleteVisionItem);
  const updateVisionCaption = useStore((s) => s.updateVisionCaption);

  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [cat, setCat] = useState<LifeCategory>('lifestyle');
  const [openId, setOpenId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const board = boards.find((b) => b.id === openId);

  const create = () => {
    if (!title.trim()) return;
    const id = addBoard(title.trim(), cat);
    setTitle(''); setCreating(false); setOpenId(id);
  };

  const onFiles = async (files: FileList | null) => {
    if (!files || !board) return;
    for (const file of Array.from(files).slice(0, 8)) {
      if (!file.type.startsWith('image/')) continue;
      const url = await readFileAsDataURL(file);
      addVisionItem(board.id, url, '');
    }
  };

  // ---- board canvas view ----
  if (board) {
    const meta = categoryMeta(board.category);
    return (
      <div>
        <div className="mb-5 flex items-center justify-between gap-3">
          <button onClick={() => setOpenId(null)} className="focus-ring inline-flex items-center gap-2 text-sm font-medium text-muted"><ArrowLeft size={16} /> {t('common.back')}</button>
          <div className="flex items-center gap-2">
            <Chip>{meta.emoji} {t(meta.tKey)}</Chip>
            <Button size="sm" onClick={() => fileRef.current?.click()}><ImagePlus size={15} /> {t('vision.addImage')}</Button>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} aria-label={t('vision.addImage')} />
          </div>
        </div>
        <h1 className="mb-1 font-display text-2xl font-bold">{board.title}</h1>
        <p className="mb-4 text-sm text-soft">{t('vision.dragHint')}</p>

        <div
          ref={canvasRef}
          className="relative h-[60dvh] w-full overflow-hidden rounded-[var(--radius-card)] border border-dashed border-[rgb(var(--border))] bg-black/[0.02] dark:bg-white/[0.03]"
        >
          {board.items.length === 0 && (
            <div className="absolute inset-0 grid place-items-center p-6 text-center">
              <div>
                <div className="mb-2 text-4xl">🖼️</div>
                <p className="text-sm text-muted">{t('vision.empty')}</p>
              </div>
            </div>
          )}
          {board.items.map((it) => (
            <motion.div
              key={it.id}
              drag
              dragConstraints={canvasRef}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return;
                const x = clamp(((info.point.x - rect.left) / rect.width) * 100, 0, 88);
                const y = clamp(((info.point.y - rect.top) / rect.height) * 100, 0, 85);
                moveVisionItem(board.id, it.id, x, y);
              }}
              initial={false}
              className="group absolute w-32 cursor-grab active:cursor-grabbing sm:w-40"
              style={{ left: `${it.x}%`, top: `${it.y}%` }}
              whileDrag={{ scale: 1.05, zIndex: 30 }}
            >
              <div className="overflow-hidden rounded-2xl border-2 border-white/70 shadow-lg dark:border-white/20">
                <img src={it.image} alt={it.caption} className="aspect-square w-full object-cover" draggable={false} />
              </div>
              <input
                value={it.caption}
                onChange={(e) => updateVisionCaption(board.id, it.id, e.target.value)}
                placeholder="…"
                className="mt-1 w-full rounded-lg bg-transparent px-1 text-center text-xs font-medium outline-none placeholder:text-soft"
              />
              <button onClick={() => deleteVisionItem(board.id, it.id)} className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100" aria-label="Delete">
                <X size={13} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // ---- boards grid ----
  return (
    <div>
      <PageHeader
        title={t('vision.title')}
        action={<Button size="sm" onClick={() => setCreating(true)}><Plus size={16} /> {t('vision.new')}</Button>}
      />

      {boards.length === 0 ? (
        <EmptyState emoji="🖼️" title={t('common.empty')} hint={t('vision.empty')} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((b) => {
            const meta = categoryMeta(b.category);
            const cover = b.items.slice(0, 4);
            return (
              <motion.button
                key={b.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                onClick={() => setOpenId(b.id)}
                className="card group overflow-hidden p-0 text-left"
              >
                <div className={`relative grid aspect-[4/3] grid-cols-2 gap-0.5 bg-gradient-to-br ${meta.gradient} p-0.5`}>
                  {cover.length === 0 && <div className="col-span-2 grid place-items-center text-4xl">{meta.emoji}</div>}
                  {cover.map((it) => <img key={it.id} src={it.image} alt="" className="size-full object-cover" />)}
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-semibold">{b.title}</h3>
                    <span className="text-xs text-soft">{t(meta.tKey)} · {b.items.length} {lang === 'vi' ? 'ảnh' : 'images'}</span>
                  </div>
                  <IconButton label="Delete" onClick={(e) => { e.stopPropagation(); deleteBoard(b.id); }}><Trash2 size={15} /></IconButton>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      <Modal
        open={creating} onClose={() => setCreating(false)} title={t('vision.new')}
        footer={<><Button variant="ghost" onClick={() => setCreating(false)}>{t('common.cancel')}</Button><Button onClick={create} disabled={!title.trim()}>{t('common.save')}</Button></>}
      >
        <div className="space-y-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('journal.titlePlaceholder')} autoFocus />
          <div>
            <p className="mb-2 text-sm font-medium text-muted">{t('nav.affirmations')}</p>
            <CategoryPicker value={cat} onChange={setCat} />
          </div>
        </div>
      </Modal>

      {/* category quick legend */}
      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.slice(0, 6).map((c) => <Pill key={c.key} onClick={() => { setCat(c.key); setCreating(true); }}>{c.emoji} {t(c.tKey)}</Pill>)}
      </div>
    </div>
  );
}
