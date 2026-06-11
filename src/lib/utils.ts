import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { DayKey } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Local-day key (YYYY-MM-DD) — avoids UTC off-by-one around midnight. */
export function dayKey(d: Date = new Date()): DayKey {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(key: DayKey, n: number): DayKey {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d + n);
  return dayKey(date);
}

export function diffDays(a: DayKey, b: DayKey): number {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const da = new Date(ay, am - 1, ad).getTime();
  const db = new Date(by, bm - 1, bd).getTime();
  return Math.round((da - db) / 86_400_000);
}

export function lastNDays(n: number, end: DayKey = dayKey()): DayKey[] {
  const out: DayKey[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(addDays(end, -i));
  return out;
}

export type PartOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export function partOfDay(d: Date = new Date()): PartOfDay {
  const h = d.getHours();
  if (h < 5) return 'night';
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  if (h < 21) return 'evening';
  return 'night';
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function pct(n: number, total: number) {
  if (total <= 0) return 0;
  return clamp(Math.round((n / total) * 100), 0, 100);
}

let _seq = 0;
/** Monotonic-ish id; nanoid is used where collision resistance matters. */
export function uid(prefix = '') {
  _seq = (_seq + 1) % 1e6;
  return `${prefix}${Date.now().toString(36)}${_seq.toString(36)}`;
}

export function formatDate(iso: string, lang: 'en' | 'vi') {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelative(iso: string, lang: 'en' | 'vi') {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const en = lang === 'en';
  if (mins < 1) return en ? 'just now' : 'vừa xong';
  if (mins < 60) return en ? `${mins}m ago` : `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return en ? `${hrs}h ago` : `${hrs} giờ trước`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return en ? `${days}d ago` : `${days} ngày trước`;
  return formatDate(iso, lang);
}

export function mmss(totalSec: number) {
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function download(filename: string, content: string, mime = 'application/json') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
