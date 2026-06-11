import { useRef, type ReactNode } from 'react';
import { Globe, Palette, Eye, Bell, Database, User, Info, Download, Upload, Trash2, FileJson, FileText, FileChartColumn } from 'lucide-react';
import { useStore, useSettings } from '@/lib/store';
import { useT } from '@/hooks/useT';
import { useToast } from '@/components/ui/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, Button } from '@/components/ui/primitives';
import { Input, Segmented } from '@/components/ui/Field';
import { exportJSON, exportCSV, exportPDF, parseImport } from '@/lib/export';
import { cn } from '@/lib/utils';
import type { ThemeMode, ReminderPref } from '@/lib/types';
import type { TKey } from '@/lib/i18n';

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch" aria-checked={checked} aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn('focus-ring relative h-7 w-12 shrink-0 rounded-full transition', checked ? 'btn-grad' : 'bg-black/15 dark:bg-white/15')}
    >
      <span className={cn('absolute top-0.5 size-6 rounded-full bg-white shadow transition-all', checked ? 'left-[1.4rem]' : 'left-0.5')} />
    </button>
  );
}

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <Card className="mb-4">
      <h2 className="mb-4 flex items-center gap-2 font-semibold">{icon} {title}</h2>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-soft">{hint}</div>}
      </div>
      {children}
    </div>
  );
}

const REMINDER_LABEL: Record<ReminderPref['kind'], TKey> = {
  affirmation: 'nav.affirmations', method369: 'm369.title', gratitude: 'nav.gratitude',
  visualization: 'nav.visualize', journal: 'nav.journal', mood: 'nav.mood',
};

export default function SettingsPage() {
  const { t, lang } = useT();
  const { toast } = useToast();
  const settings = useSettings();
  const data = useStore((s) => s.data);
  const setLanguage = useStore((s) => s.setLanguage);
  const setTheme = useStore((s) => s.setTheme);
  const patchSettings = useStore((s) => s.patchSettings);
  const setReminder = useStore((s) => s.setReminder);
  const setProfile = useStore((s) => s.setProfile);
  const importData = useStore((s) => s.importData);
  const resetAll = useStore((s) => s.resetAll);
  const fileRef = useRef<HTMLInputElement>(null);

  const onImport = async (file?: File) => {
    if (!file) return;
    const text = await file.text();
    const parsed = parseImport(text);
    if (parsed) { importData(parsed); toast(t('common.done'), '✅'); }
    else toast(lang === 'vi' ? 'Tệp không hợp lệ' : 'Invalid file', '⚠️');
  };

  return (
    <div>
      <PageHeader title={t('set.title')} />

      <Section icon={<User size={17} />} title={t('set.profile')}>
        <Row label={t('set.name')}>
          <Input value={data.user.name} onChange={(e) => setProfile({ name: e.target.value })} className="max-w-44" />
        </Row>
        <Row label="Avatar">
          <div className="flex gap-1.5">
            {['🌙', '✨', '🪷', '🌿', '☀️', '💜'].map((e) => (
              <button key={e} onClick={() => setProfile({ avatarEmoji: e })} className={cn('focus-ring grid size-9 place-items-center rounded-xl text-lg transition', data.user.avatarEmoji === e ? 'bg-lavender/25 ring-1 ring-lavender' : 'bg-black/[0.04] dark:bg-white/[0.05]')}>{e}</button>
            ))}
          </div>
        </Row>
      </Section>

      <Section icon={<Globe size={17} />} title={t('set.language')}>
        <Row label={t('set.language')}>
          <Segmented value={lang} onChange={setLanguage} options={[{ value: 'en', label: 'English' }, { value: 'vi', label: 'Tiếng Việt' }]} />
        </Row>
      </Section>

      <Section icon={<Palette size={17} />} title={t('set.appearance')}>
        <Row label={t('set.theme')}>
          <Segmented<ThemeMode>
            value={settings.theme}
            onChange={setTheme}
            options={[{ value: 'system', label: t('set.themeSystem') }, { value: 'light', label: t('set.themeLight') }, { value: 'dark', label: t('set.themeDark') }]}
          />
        </Row>
      </Section>

      <Section icon={<Eye size={17} />} title={t('set.accessibility')}>
        <Row label={t('set.largeText')}><Switch checked={settings.largeText} onChange={(v) => patchSettings({ largeText: v })} label={t('set.largeText')} /></Row>
        <Row label={t('set.reduceMotion')}><Switch checked={settings.reduceMotion} onChange={(v) => patchSettings({ reduceMotion: v })} label={t('set.reduceMotion')} /></Row>
        <Row label={t('set.sound')} hint={lang === 'vi' ? 'Đọc to câu khẳng định' : 'Spoken affirmations'}><Switch checked={settings.soundEnabled} onChange={(v) => patchSettings({ soundEnabled: v })} label={t('set.sound')} /></Row>
        <Row label={t('set.music')}><Switch checked={settings.backgroundMusic} onChange={(v) => patchSettings({ backgroundMusic: v })} label={t('set.music')} /></Row>
      </Section>

      <Section icon={<Bell size={17} />} title={t('set.notifications')}>
        <Row label={t('set.notifications')} hint={lang === 'vi' ? 'Nhắc nhở thực hành' : 'Practice reminders'}>
          <Switch checked={settings.notificationsEnabled} onChange={(v) => patchSettings({ notificationsEnabled: v })} label={t('set.notifications')} />
        </Row>
        {settings.notificationsEnabled && (
          <div className="space-y-2 rounded-2xl bg-black/[0.03] p-3 dark:bg-white/[0.04]">
            <div className="text-xs font-semibold text-soft">{t('set.reminders')}</div>
            {settings.reminders.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3">
                <span className="text-sm">{t(REMINDER_LABEL[r.kind])}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="time" value={r.time} aria-label={t(REMINDER_LABEL[r.kind])}
                    onChange={(e) => setReminder({ ...r, time: e.target.value })}
                    className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))]/60 px-2 py-1 text-sm outline-none focus:border-lavender"
                  />
                  <Switch checked={r.enabled} onChange={(v) => setReminder({ ...r, enabled: v })} label={`${t(REMINDER_LABEL[r.kind])} ${r.time}`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section icon={<Database size={17} />} title={t('set.data')}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Button variant="outline" size="sm" onClick={() => exportJSON(data)}><FileJson size={15} /> {t('set.exportJson')}</Button>
          <Button variant="outline" size="sm" onClick={() => exportCSV(data)}><FileText size={15} /> {t('set.exportCsv')}</Button>
          <Button variant="outline" size="sm" onClick={() => exportPDF(data, lang)}><FileChartColumn size={15} /> {t('set.exportPdf')}</Button>
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}><Upload size={15} /> {t('set.import')}</Button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => onImport(e.target.files?.[0])} aria-label={t('set.import')} />
        </div>
        <button
          onClick={() => { if (window.confirm(t('set.resetConfirm'))) { resetAll(); toast(t('common.done'), '🧹'); } }}
          className="focus-ring inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-500 transition hover:bg-rose-500/10"
        >
          <Trash2 size={15} /> {t('set.reset')}
        </button>
      </Section>

      <Section icon={<Info size={17} />} title={t('set.about')}>
        <p className="text-sm text-muted">{t('set.aboutBody')}</p>
        <p className="text-xs text-soft">{t('appName')} · v1.0 · <Download size={11} className="inline" /> local-first</p>
      </Section>
    </div>
  );
}
