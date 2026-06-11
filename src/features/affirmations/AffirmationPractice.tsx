import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Volume2, Sparkle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/hooks/useT';
import { useToast } from '@/components/ui/Toast';
import { Segmented } from '@/components/ui/Field';
import type { LifeCategory } from '@/lib/types';

interface Props {
  open: boolean;
  onClose: () => void;
  affId: string | null;
  text: string;
  category: LifeCategory;
}

const TARGETS = [3, 10, 21, 55];

export function AffirmationPractice({ open, onClose, affId, text, category }: Props) {
  const { t, lang } = useT();
  const { toast } = useToast();
  const logAffirmation = useStore((s) => s.logAffirmation);
  const soundEnabled = useStore((s) => s.data.settings.soundEnabled);

  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(21);
  const [mirror, setMirror] = useState(false);
  const [camOk, setCamOk] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const loggedRef = useRef(0);

  // reset on open
  useEffect(() => {
    if (open) { setCount(0); loggedRef.current = 0; }
  }, [open, affId]);

  // mirror camera lifecycle
  useEffect(() => {
    let cancelled = false;
    async function start() {
      if (mirror && open) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
          if (cancelled) { stream.getTracks().forEach((tr) => tr.stop()); return; }
          streamRef.current = stream;
          if (videoRef.current) { videoRef.current.srcObject = stream; setCamOk(true); }
        } catch { setCamOk(false); }
      }
    }
    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
      setCamOk(false);
    };
  }, [mirror, open]);

  // persist reps on close
  const finish = () => {
    const unlogged = count - loggedRef.current;
    if (unlogged > 0) logAffirmation(affId, text, category, unlogged, mirror);
    onClose();
    setMirror(false);
  };

  const speak = () => {
    if (!soundEnabled || typeof speechSynthesis === 'undefined') return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'vi' ? 'vi-VN' : 'en-US';
    u.rate = 0.92; u.pitch = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };

  const tap = () => {
    const next = count + 1;
    setCount(next);
    if ('vibrate' in navigator) navigator.vibrate?.(8);
    if (next === target) {
      logAffirmation(affId, text, category, next - loggedRef.current, mirror);
      loggedRef.current = next;
      toast(t('common.greatJob'), '✨');
    }
  };

  const progress = Math.min(1, count / target);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          {/* backdrop / mirror */}
          <div className="absolute inset-0 btn-grad" />
          {mirror && camOk && (
            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 size-full -scale-x-100 object-cover opacity-80" />
          )}
          <div className="absolute inset-0 bg-indigo-deep/40" />

          {/* header */}
          <div className="relative z-10 flex items-center justify-between px-5 pt-5 text-white">
            <Segmented
              value={String(target)}
              onChange={(v) => setTarget(Number(v))}
              options={TARGETS.map((n) => ({ value: String(n), label: `${n}` }))}
            />
            <button onClick={finish} aria-label="Close" className="focus-ring grid size-10 place-items-center rounded-full bg-white/15 backdrop-blur">
              <X size={18} />
            </button>
          </div>

          {/* tap area */}
          <button
            onClick={tap}
            className="relative z-10 flex flex-1 cursor-pointer select-none flex-col items-center justify-center px-7 text-center text-white"
          >
            <motion.div
              key={count}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6 font-display text-6xl font-bold tabular-nums drop-shadow"
            >
              {count}
              <span className="text-2xl font-medium text-white/70"> / {target}</span>
            </motion.div>
            <p className="max-w-lg font-display text-2xl font-semibold leading-snug drop-shadow sm:text-3xl">
              “{text}”
            </p>
            <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
              <Sparkle size={14} /> {t('aff.tapToCount')}
            </p>
          </button>

          {/* progress + controls */}
          <div className="relative z-10 px-5 pb-8">
            <div className="mx-auto mb-4 h-2 max-w-lg overflow-hidden rounded-full bg-white/20">
              <motion.div className="h-full rounded-full bg-white" animate={{ width: `${progress * 100}%` }} />
            </div>
            <div className="mx-auto flex max-w-lg items-center justify-center gap-3">
              <button onClick={speak} className="focus-ring inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur">
                <Volume2 size={16} /> {lang === 'vi' ? 'Đọc' : 'Speak'}
              </button>
              <button
                onClick={() => setMirror((m) => !m)}
                aria-pressed={mirror}
                className={`focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold backdrop-blur transition ${mirror ? 'bg-white text-indigo' : 'bg-white/15 text-white'}`}
              >
                🪞 {t('aff.mirrorMode')}
              </button>
            </div>
            {mirror && !camOk && (
              <p className="mx-auto mt-3 max-w-xs text-center text-xs text-white/80">{t('aff.mirrorHint')}</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
