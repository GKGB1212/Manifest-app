import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Send, Sparkles, Trash2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/hooks/useT';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, Pill, Card, EmptyState, IconButton } from '@/components/ui/primitives';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Field';
import { futurePrompt } from '@/lib/data/content';
import { formatDate } from '@/lib/utils';
import type { FutureHorizon } from '@/lib/types';

const HORIZONS: { key: FutureHorizon; tKey: 'future.6m' | 'future.1y' | 'future.5y'; emoji: string }[] = [
  { key: '6m', tKey: 'future.6m', emoji: '🌱' },
  { key: '1y', tKey: 'future.1y', emoji: '🌿' },
  { key: '5y', tKey: 'future.5y', emoji: '🌳' },
];

const FUTURE_REPLIES: { en: string; vi: string }[] = [
  { en: 'I remember feeling exactly that. Trust me — the steps you take now are the reason I get to be here. Keep going gently.', vi: 'Tôi nhớ cảm giác đó y hệt. Tin tôi đi — những bước bạn đi hôm nay là lý do tôi có mặt ở đây. Cứ tiếp tục nhẹ nhàng.' },
  { en: 'Be proud of how far you have come. What feels heavy now becomes a story you tell with a smile.', vi: 'Hãy tự hào về chặng đường đã qua. Điều nặng nề bây giờ sẽ thành câu chuyện bạn kể với nụ cười.' },
  { en: 'The thing you are worried about works out differently than you expect — and better. Focus on the next kind action.', vi: 'Điều bạn đang lo sẽ diễn ra khác với bạn nghĩ — và tốt hơn. Hãy tập trung vào hành động tử tế tiếp theo.' },
];

export default function FuturePage() {
  const { t, lang } = useT();
  const letters = useStore((s) => s.data.futureSelf);
  const addFutureLetter = useStore((s) => s.addFutureLetter);
  const addFutureTurn = useStore((s) => s.addFutureTurn);
  const deleteFuture = useStore((s) => s.deleteFuture);

  const [tab, setTab] = useState<FutureHorizon>('1y');
  const [writing, setWriting] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const filtered = letters.filter((l) => l.horizon === tab);
  const active = letters.find((l) => l.id === openId);

  const save = () => {
    if (!body.trim()) return;
    addFutureLetter(tab, title.trim() || (lang === 'vi' ? 'Lá thư' : 'Letter'), body);
    setTitle(''); setBody(''); setWriting(false);
  };

  const sendTurn = () => {
    if (!active || !msg.trim()) return;
    addFutureTurn(active.id, 'me', msg.trim());
    setMsg('');
    const reply = FUTURE_REPLIES[Math.floor(Math.random() * FUTURE_REPLIES.length)];
    setTimeout(() => addFutureTurn(active.id, 'future', lang === 'vi' ? reply.vi : reply.en), 600);
  };

  return (
    <div>
      <PageHeader
        title={t('future.title')}
        subtitle={t('future.subtitle')}
        action={<Button size="sm" onClick={() => { setBody(futurePrompt(lang, 0) + '\n'); setWriting(true); }}><Plus size={16} /> {t('future.letter')}</Button>}
      />

      <div className="mb-5 flex gap-2">
        {HORIZONS.map((h) => (
          <Pill key={h.key} active={tab === h.key} onClick={() => setTab(h.key)}>{h.emoji} {t(h.tKey)}</Pill>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState emoji="💌" title={t('common.empty')} hint={t('future.subtitle')} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((l) => (
            <motion.div key={l.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card flex flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{l.title}</h3>
                <IconButton label="Delete" onClick={() => deleteFuture(l.id)}><Trash2 size={15} /></IconButton>
              </div>
              <p className="mt-1.5 line-clamp-4 whitespace-pre-wrap text-sm text-muted">{l.body}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-soft">{formatDate(l.createdAt, lang)}</span>
                <Button size="sm" variant="soft" onClick={() => setOpenId(l.id)}><Sparkles size={14} /> {t('future.converse')}</Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* write letter */}
      <Modal
        open={writing}
        onClose={() => setWriting(false)}
        title={`${t('future.letter')} · ${t(HORIZONS.find((h) => h.key === tab)!.tKey)}`}
        size="lg"
        footer={<><Button variant="ghost" onClick={() => setWriting(false)}>{t('common.cancel')}</Button><Button onClick={save} disabled={!body.trim()}>{t('common.save')}</Button></>}
      >
        <div className="space-y-3">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('journal.titlePlaceholder')} />
          <Textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} placeholder={lang === 'vi' ? 'Gửi tôi của tương lai…' : 'Dear future me…'} autoFocus />
        </div>
      </Modal>

      {/* conversation */}
      <Modal open={!!active} onClose={() => setOpenId(null)} title={active?.title} size="md">
        {active && (
          <div className="flex h-[60dvh] flex-col">
            <Card className="mb-3 max-h-32 overflow-y-auto scroll-thin bg-lavender/10 text-sm">
              <p className="whitespace-pre-wrap text-muted">{active.body}</p>
            </Card>
            <div className="flex-1 space-y-2.5 overflow-y-auto scroll-thin pr-1">
              {(active.conversation ?? []).length === 0 && (
                <p className="py-6 text-center text-sm text-soft">{lang === 'vi' ? 'Hãy hỏi bản thân tương lai một điều…' : 'Ask your future self something…'}</p>
              )}
              {(active.conversation ?? []).map((c, i) => (
                <div key={i} className={`flex ${c.role === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${c.role === 'me' ? 'bg-indigo text-white' : 'bg-black/[0.05] dark:bg-white/[0.06]'}`}>
                    {c.role === 'future' && <div className="mb-0.5 text-xs font-semibold text-indigo dark:text-lilac">🌳 {t('future.title')}</div>}
                    {c.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendTurn()} placeholder={t('coach.placeholder')} />
              <Button onClick={sendTurn} disabled={!msg.trim()}><Send size={16} /></Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
