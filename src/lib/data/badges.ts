import type { AppData, Language } from '../types';

export interface BadgeDef {
  id: string;
  emoji: string;
  name: { en: string; vi: string };
  desc: { en: string; vi: string };
  /** returns 0..1 progress toward unlock given current data */
  progress: (d: AppData) => number;
}

const count = (n: number, target: number) => Math.min(1, n / target);

export const BADGES: BadgeDef[] = [
  {
    id: 'first-step',
    emoji: '🌱',
    name: { en: 'First Step', vi: 'Bước đầu tiên' },
    desc: { en: 'Complete your first practice', vi: 'Hoàn thành thực hành đầu tiên' },
    progress: (d) => (Object.keys(d.activity).length > 0 ? 1 : 0),
  },
  {
    id: 'streak-7',
    emoji: '🔥',
    name: { en: '7-Day Streak', vi: 'Chuỗi 7 ngày' },
    desc: { en: 'Practice 7 days in a row', vi: 'Thực hành 7 ngày liên tiếp' },
    progress: (d) => count(d.streak.longest, 7),
  },
  {
    id: 'streak-30',
    emoji: '⚡',
    name: { en: '30-Day Streak', vi: 'Chuỗi 30 ngày' },
    desc: { en: 'Practice 30 days in a row', vi: 'Thực hành 30 ngày liên tiếp' },
    progress: (d) => count(d.streak.longest, 30),
  },
  {
    id: 'gratitude-100',
    emoji: '🌼',
    name: { en: 'Grateful Heart', vi: 'Trái tim biết ơn' },
    desc: { en: 'Log 100 gratitude items', vi: 'Ghi 100 điều biết ơn' },
    progress: (d) => count(d.gratitude.reduce((s, g) => s + g.items.filter(Boolean).length, 0), 100),
  },
  {
    id: 'viz-50',
    emoji: '🧘',
    name: { en: 'Inner Cinema', vi: 'Rạp chiếu nội tâm' },
    desc: { en: 'Finish 50 visualizations', vi: 'Hoàn thành 50 phiên hình dung' },
    progress: (d) => count(d.visualizations.filter((v) => v.completed).length, 50),
  },
  {
    id: 'aff-1000',
    emoji: '📿',
    name: { en: 'Thousand Echoes', vi: 'Ngàn tiếng vọng' },
    desc: { en: 'Repeat affirmations 1000 times', vi: 'Lặp lại khẳng định 1000 lần' },
    progress: (d) => count(d.affirmations.reduce((s, a) => s + a.repetitions, 0), 1000),
  },
  {
    id: 'evidence-25',
    emoji: '🔭',
    name: { en: 'Evidence Seeker', vi: 'Người tìm dấu hiệu' },
    desc: { en: 'Log 25 pieces of evidence', vi: 'Ghi 25 dấu hiệu' },
    progress: (d) => count(d.evidence.length, 25),
  },
  {
    id: 'goal-achieved',
    emoji: '🏆',
    name: { en: 'It Manifested', vi: 'Đã thành hiện thực' },
    desc: { en: 'Achieve a manifestation goal', vi: 'Đạt được một mục tiêu' },
    progress: (d) => (d.goals.some((g) => g.status === 'achieved') ? 1 : 0),
  },
  {
    id: 'scribe-30',
    emoji: '✍️',
    name: { en: 'Devoted Scribe', vi: 'Người chép tận tâm' },
    desc: { en: 'Write 30 journal entries', vi: 'Viết 30 bài nhật ký' },
    progress: (d) => count(d.journal.length, 30),
  },
  {
    id: 'mood-30',
    emoji: '💜',
    name: { en: 'Self-Aware', vi: 'Thấu hiểu bản thân' },
    desc: { en: 'Complete 30 mood check-ins', vi: 'Hoàn thành 30 lần ghi nhận cảm xúc' },
    progress: (d) => count(d.moods.length, 30),
  },
  {
    id: 'master',
    emoji: '👑',
    name: { en: 'Manifestation Master', vi: 'Bậc thầy Manifestation' },
    desc: { en: 'Reach level 10', vi: 'Đạt cấp 10' },
    progress: (d) => count(d.user.level, 10),
  },
];

export const badgeName = (b: BadgeDef, l: Language) => (l === 'vi' ? b.name.vi : b.name.en);
export const badgeDesc = (b: BadgeDef, l: Language) => (l === 'vi' ? b.desc.vi : b.desc.en);
