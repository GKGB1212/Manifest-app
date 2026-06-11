import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { useT } from '@/hooks/useT';
import { detectLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/primitives';
import { Input } from '@/components/ui/Field';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import type { Language } from '@/lib/types';

export function Onboarding() {
  const setLanguage = useStore((s) => s.setLanguage);
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const lang = useStore((s) => s.data.settings.language);
  const { t } = useT();
  const [name, setName] = useState('');

  // default language from browser on first paint
  useEffect(() => setLanguage(detectLanguage()), [setLanguage]);

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden px-5">
      <div className="pointer-events-none absolute -left-20 top-0 size-72 rounded-full bg-lavender/30 blur-3xl animate-float" />
      <div className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-indigo/20 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass relative z-10 w-full max-w-md rounded-[2rem] p-8 text-center"
      >
        <div className="absolute right-5 top-5"><LanguageToggle /></div>
        <div className="mx-auto mb-5 grid size-16 place-items-center rounded-3xl btn-grad text-3xl animate-breathe">🌙</div>
        <h1 className="font-display text-2xl font-bold">{t('onb.welcome')}</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted">{t('onb.intro')}</p>

        <div className="mt-7 text-left">
          <label className="mb-2 block text-sm font-medium text-muted">{t('onb.yourName')}</label>
          <Input
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && name.trim() && completeOnboarding(name, lang as Language)}
            placeholder={lang === 'vi' ? 'Tên hoặc biệt danh…' : 'Your name or a nickname…'}
          />
        </div>

        <Button
          block
          size="lg"
          className="mt-5"
          disabled={!name.trim()}
          onClick={() => completeOnboarding(name, lang as Language)}
        >
          {t('onb.begin')} →
        </Button>
        <p className="mt-4 text-xs text-soft">{t('set.aboutBody')}</p>
      </motion.div>
    </div>
  );
}
