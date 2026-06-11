import { useCallback } from 'react';
import { useLang } from '@/lib/store';
import { translate, type TKey } from '@/lib/i18n';
import type { Language } from '@/lib/types';

/** Returns a memoised translator bound to the active language. */
export function useT() {
  const lang = useLang();
  const t = useCallback(
    (key: TKey, vars?: Record<string, string | number>) => translate(lang, key, vars),
    [lang],
  );
  return { t, lang: lang as Language };
}
