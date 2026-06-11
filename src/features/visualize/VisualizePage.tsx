import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, X, Pause, Brain } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/hooks/useT';
import { useToast } from '@/components/ui/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, Card, Stat } from '@/components/ui/primitives';
import { VIZ_SCRIPTS, vizScript, type VizScript } from '@/lib/data/content';
import { mmss } from '@/lib/utils';

function Player({ script, minutes, onClose }: { script: VizScript; minutes: number; onClose: () => void }) {
  const { t, lang } = useT();
  const { toast } = useToast();
  const complete = useStore((s) => s.completeVisualization);
  const total = minutes * 60;
  const compiled = vizScript(lang, script);

  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const savedRef = useRef(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setElapsed((e) => Math.min(total, e + 1)), 1000);
    return () => clearInterval(id);
  }, [paused, total]);

  // 10s breathing cycle (4 in / 6 out feel)
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setPhase((p) => (p === 'in' ? 'out' : 'in')), 5000);
    return () => clearInterval(id);
  }, [paused]);

  const finish = (completed: boolean) => {
    if (!savedRef.current) {
      savedRef.current = true;
      complete({ scriptId: script.id, title: compiled.titleText, durationSec: total, completedSec: elapsed, completed });
      if (completed) toast(t('viz.sessionComplete'), '🧘');
    }
    onClose();
  };

  useEffect(() => { if (elapsed >= total) finish(true); /* eslint-disable-next-line */ }, [elapsed, total]);

  const stepIdx = Math.min(compiled.stepTexts.length - 1, Math.floor((elapsed / total) * compiled.stepTexts.length));
  const remaining = total - elapsed;

  return createPortal(
    <motion.div className={`fixed inset-0 z-[70] flex flex-col bg-gradient-to-br ${script.theme}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-indigo-deep/30" />
      <div className="relative z-10 flex items-center justify-between p-5 text-white">
        <span className="font-display text-lg font-semibold">{compiled.titleText}</span>
        <button onClick={() => finish(false)} aria-label="Close" className="focus-ring grid size-10 place-items-center rounded-full bg-white/15 backdrop-blur"><X size={18} /></button>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 text-center text-white">
        <motion.div
          className="grid size-56 place-items-center rounded-full bg-white/10 backdrop-blur"
          animate={{ scale: paused ? 1 : phase === 'in' ? 1.18 : 0.92 }}
          transition={{ duration: 5, ease: 'easeInOut' }}
        >
          <motion.div className="grid size-40 place-items-center rounded-full bg-white/15">
            <span className="text-sm font-medium">{phase === 'in' ? t('viz.breatheIn') : t('viz.breatheOut')}</span>
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.p
            key={stepIdx}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="mt-10 max-w-md font-display text-xl font-medium leading-relaxed drop-shadow"
          >
            {compiled.stepTexts[stepIdx]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4 pb-10">
        <div className="font-display text-3xl font-bold tabular-nums text-white">{mmss(remaining)}</div>
        <button onClick={() => setPaused((p) => !p)} className="focus-ring grid size-16 place-items-center rounded-full bg-white text-indigo shadow-lg active:scale-95">
          {paused ? <Play size={26} className="ml-1" /> : <Pause size={26} />}
        </button>
      </div>
    </motion.div>,
    document.body,
  );
}

export default function VisualizePage() {
  const { t, lang } = useT();
  const sessions = useStore((s) => s.data.visualizations);
  const [active, setActive] = useState<{ script: VizScript; minutes: number } | null>(null);

  const totalMin = Math.round(sessions.reduce((s, v) => s + v.completedSec, 0) / 60);
  const completedCount = sessions.filter((v) => v.completed).length;

  return (
    <div>
      <PageHeader title={t('viz.title')} subtitle={t('viz.subtitle')} />

      <div className="mb-5 grid grid-cols-3 gap-3">
        <Stat label={t('common.completed')} value={completedCount} />
        <Stat label={t('common.minutes')} value={totalMin} />
        <Stat label={t('dash.statSessions')} value={sessions.length} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {VIZ_SCRIPTS.map((s) => {
          const compiled = vizScript(lang, s);
          return (
            <Card key={s.id} className="relative overflow-hidden">
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${s.theme} opacity-10`} />
              <div className="relative">
                <div className="mb-2 flex items-center gap-2">
                  <span className={`grid size-10 place-items-center rounded-2xl bg-gradient-to-br ${s.theme} text-white`}><Brain size={18} /></span>
                  <h3 className="font-display text-lg font-semibold">{compiled.titleText}</h3>
                </div>
                <p className="mb-4 text-sm text-muted">{compiled.stepTexts[0]}</p>
                <div className="flex flex-wrap gap-2">
                  {s.durations.map((m) => (
                    <Button key={m} size="sm" variant="soft" onClick={() => setActive({ script: s, minutes: m })}>
                      <Play size={13} /> {m} {t('common.minutes')}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <AnimatePresence>
        {active && <Player script={active.script} minutes={active.minutes} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </div>
  );
}
