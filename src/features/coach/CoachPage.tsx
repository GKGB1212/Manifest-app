import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Lightbulb, NotebookPen, Info } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/hooks/useT';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/primitives';
import { Input } from '@/components/ui/Field';
import { coachReply, coachSuggestAffirmation, coachSpotLimiting, coachScriptingPrompt } from '@/lib/data/coach';

export default function CoachPage() {
  const { t, lang } = useT();
  const conversations = useStore((s) => s.data.coach);
  const newConversation = useStore((s) => s.newConversation);
  const pushCoachMessage = useStore((s) => s.pushCoachMessage);
  const data = useStore((s) => s.data);

  const convId = conversations[0]?.id;
  const conv = conversations.find((c) => c.id === convId);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  // ensure a conversation with an intro message
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    if (conversations.length === 0) {
      const id = newConversation();
      pushCoachMessage(id, { role: 'coach', text: t('coach.intro') });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [conv?.messages.length, typing]);

  const respond = (userText: string, replyFn: () => string) => {
    if (!convId) return;
    if (userText) pushCoachMessage(convId, { role: 'user', text: userText });
    setTyping(true);
    setTimeout(() => {
      pushCoachMessage(convId, { role: 'coach', text: replyFn() });
      setTyping(false);
    }, 700);
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    respond(text, () => coachReply(text, data, lang));
  };

  const quick = [
    { label: t('coach.suggest.affirmation'), icon: Sparkles, fn: () => respond('', () => coachSuggestAffirmation(data, lang)) },
    { label: t('coach.suggest.limiting'), icon: Lightbulb, fn: () => respond('', () => coachSpotLimiting(lang)) },
    { label: t('coach.suggest.scripting'), icon: NotebookPen, fn: () => respond('', () => coachScriptingPrompt(lang)) },
  ];

  return (
    <div className="flex h-[calc(100dvh-7rem)] flex-col lg:h-[calc(100dvh-5rem)]">
      <PageHeader title={t('coach.title')} subtitle={t('coach.subtitle')} />

      <div className="mb-3 flex items-start gap-2 rounded-2xl bg-lavender/10 px-3.5 py-2.5 text-xs text-muted">
        <Info size={15} className="mt-0.5 shrink-0 text-indigo dark:text-lilac" />
        {t('coach.disclaimer')}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto scroll-thin rounded-[var(--radius-card)] bg-black/[0.02] p-4 dark:bg-white/[0.03]">
        {conv?.messages.map((m) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'btn-grad text-white' : 'card'}`}>
              {m.role === 'coach' && <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-indigo dark:text-lilac"><Sparkles size={12} /> {t('coach.title')}</div>}
              {m.text}
            </div>
          </motion.div>
        ))}
        <AnimatePresence>
          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-start">
              <div className="card flex gap-1 px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} className="size-2 rounded-full bg-lavender" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.15 }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {quick.map((q) => (
          <button key={q.label} onClick={q.fn} className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-lavender/15 px-3 py-1.5 text-xs font-medium text-indigo transition hover:bg-lavender/25 dark:text-lilac">
            <q.icon size={13} /> {q.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder={t('coach.placeholder')} />
        <Button onClick={send} disabled={!input.trim()}><Send size={16} /></Button>
      </div>
    </div>
  );
}
