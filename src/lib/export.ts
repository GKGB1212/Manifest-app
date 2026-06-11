import type { AppData, Language } from './types';
import { download, formatDate } from './utils';
import { translate } from './i18n';

export function exportJSON(data: AppData) {
  download(`manifest-backup-${Date.now()}.json`, JSON.stringify(data, null, 2), 'application/json');
}

function csvRow(cells: (string | number)[]) {
  return cells.map((c) => `"${String(c).replace(/"/g, '""').replace(/\n/g, ' ')}"`).join(',');
}

/** A single tidy CSV unifying the major journal-like records. */
export function exportCSV(data: AppData) {
  const rows: string[] = [csvRow(['type', 'date', 'category', 'detail', 'value'])];
  for (const a of data.affirmationLogs) rows.push(csvRow(['affirmation', a.day, '', `x${a.count}`, a.mirrorMode ? 'mirror' : '']));
  for (const g of data.gratitude) rows.push(csvRow(['gratitude', g.day, '', g.items.filter(Boolean).join(' | '), g.mood ?? '']));
  for (const j of data.journal) rows.push(csvRow(['journal', j.createdAt.slice(0, 10), j.kind, j.title, j.mood ?? '']));
  for (const m of data.moods) rows.push(csvRow(['mood', m.day, '', m.note ?? '', `mood:${m.mood} energy:${m.energy} belief:${m.selfBelief}`]));
  for (const e of data.evidence) rows.push(csvRow(['evidence', e.createdAt.slice(0, 10), e.kind, e.note, e.emotionalCharge]));
  for (const go of data.goals) rows.push(csvRow(['goal', go.createdAt.slice(0, 10), go.category, go.title, go.status]));
  for (const v of data.visualizations) rows.push(csvRow(['visualization', v.createdAt.slice(0, 10), v.scriptId, v.title, `${Math.round(v.completedSec / 60)}min`]));
  download(`manifest-history-${Date.now()}.csv`, rows.join('\n'), 'text/csv');
}

/** Opens a print-ready report; the browser's "Save as PDF" finishes the export. */
export function exportPDF(data: AppData, lang: Language) {
  const t = (k: Parameters<typeof translate>[1]) => translate(lang, k);
  const totalAff = data.affirmations.reduce((s, a) => s + a.repetitions, 0);
  const sec = (title: string, body: string) => `<section><h2>${title}</h2>${body}</section>`;
  const list = (items: string[]) => items.length ? `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>` : `<p class="muted">—</p>`;

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Manifest Report</title>
  <style>
    *{font-family:-apple-system,Segoe UI,Inter,sans-serif;color:#1e1b38}
    body{max-width:720px;margin:40px auto;padding:0 24px;line-height:1.6}
    h1{font-size:28px;margin:0 0 4px;color:#4f46e5}
    .sub{color:#6b6b86;margin:0 0 24px}
    .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:16px 0 28px}
    .stat{background:#f5f3ff;border-radius:16px;padding:14px}
    .stat b{font-size:22px;display:block;color:#4f46e5}
    .stat span{font-size:12px;color:#6b6b86}
    h2{font-size:16px;border-bottom:2px solid #ede9fe;padding-bottom:6px;margin-top:28px}
    .muted{color:#9b9bb0}
    ul{padding-left:18px} li{margin:4px 0}
    @media print{.noprint{display:none}}
  </style></head><body>
    <h1>🌙 ${t('appName')} — ${lang === 'vi' ? 'Báo cáo hành trình' : 'Journey Report'}</h1>
    <p class="sub">${data.user.name} · ${formatDate(new Date().toISOString(), lang)}</p>
    <div class="grid">
      <div class="stat"><b>${data.user.level}</b><span>${t('common.level')}</span></div>
      <div class="stat"><b>${data.streak.longest}🔥</b><span>${t('analytics.bestStreak')}</span></div>
      <div class="stat"><b>${totalAff}</b><span>${t('aff.repeat')}</span></div>
      <div class="stat"><b>${data.goals.length}</b><span>${t('nav.goals')}</span></div>
      <div class="stat"><b>${data.evidence.length}</b><span>${t('goals.evidence')}</span></div>
      <div class="stat"><b>${data.visualizations.length}</b><span>${t('dash.statSessions')}</span></div>
    </div>
    ${sec(t('nav.goals'), list(data.goals.map((g) => `<b>${g.title}</b> — ${g.status}`)))}
    ${sec(t('goals.evidence'), list(data.evidence.slice(0, 20).map((e) => `${e.note}`)))}
    ${sec(t('grat.title'), list(data.gratitude.slice(0, 10).flatMap((g) => g.items.filter(Boolean))))}
    ${sec(t('journal.title'), list(data.journal.slice(0, 12).map((j) => `<b>${j.title}</b>`)))}
    <p class="noprint muted" style="margin-top:32px">${lang === 'vi' ? 'Dùng Cmd/Ctrl+P để lưu thành PDF.' : 'Use Cmd/Ctrl+P to save as PDF.'}</p>
  </body></html>`;

  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 400);
}

export function parseImport(text: string): AppData | null {
  try {
    const obj = JSON.parse(text);
    if (obj && typeof obj === 'object' && 'user' in obj && 'settings' in obj) return obj as AppData;
    return null;
  } catch {
    return null;
  }
}
