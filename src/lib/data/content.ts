import type { Language } from '../types';

type Bi = { en: string; vi: string };
const pick = (b: Bi, l: Language) => (l === 'vi' ? b.vi : b.en);

/* --------------------------- Scripting ----------------------------- */

export const SCRIPTING_TEMPLATES: { id: string; title: Bi; body: Bi }[] = [
  {
    id: 'dream-day',
    title: { en: 'My dream day', vi: 'Ngày mơ ước của tôi' },
    body: {
      en: 'Today I woke up in my dream home. The light was soft and I felt deeply grateful as I...',
      vi: 'Hôm nay tôi thức dậy trong ngôi nhà mơ ước. Ánh sáng dịu nhẹ và tôi thấy biết ơn sâu sắc khi...',
    },
  },
  {
    id: 'career-win',
    title: { en: 'The role I love', vi: 'Công việc tôi yêu thích' },
    body: {
      en: 'I just accepted the offer I wanted. I remember opening the email and feeling...',
      vi: 'Tôi vừa nhận lời mời làm việc mình mong muốn. Tôi nhớ khoảnh khắc mở email và cảm thấy...',
    },
  },
  {
    id: 'abundance',
    title: { en: 'Abundance is here', vi: 'Sự đủ đầy đã đến' },
    body: {
      en: 'Money arrived from an unexpected source today. I felt calm and capable as I...',
      vi: 'Hôm nay tiền đến từ một nguồn bất ngờ. Tôi thấy bình tĩnh và vững vàng khi...',
    },
  },
];

export const scriptingTemplates = (l: Language) =>
  SCRIPTING_TEMPLATES.map((t) => ({ id: t.id, title: pick(t.title, l), body: pick(t.body, l) }));

export const SCRIPTING_PROMPTS: Bi[] = [
  { en: 'Describe the morning of the day your goal came true.', vi: 'Mô tả buổi sáng của ngày mục tiêu thành hiện thực.' },
  { en: 'Who is the first person you tell, and what do you say?', vi: 'Người đầu tiên bạn kể là ai, và bạn nói gì?' },
  { en: 'What does your body feel like now that it is real?', vi: 'Cơ thể bạn cảm thấy thế nào khi điều đó là thật?' },
  { en: 'Write a thank-you note to the universe for what arrived.', vi: 'Viết lời cảm ơn vũ trụ vì điều đã đến.' },
];

export const randomScriptingPrompt = (l: Language) =>
  pick(SCRIPTING_PROMPTS[Math.floor(Math.random() * SCRIPTING_PROMPTS.length)], l);

/* --------------------------- Emotions tags ------------------------- */

export const EMOTION_TAGS: Bi[] = [
  { en: 'grateful', vi: 'biết ơn' },
  { en: 'excited', vi: 'hào hứng' },
  { en: 'calm', vi: 'bình an' },
  { en: 'hopeful', vi: 'hy vọng' },
  { en: 'proud', vi: 'tự hào' },
  { en: 'loved', vi: 'được yêu thương' },
  { en: 'abundant', vi: 'đủ đầy' },
  { en: 'free', vi: 'tự do' },
  { en: 'confident', vi: 'tự tin' },
  { en: 'peaceful', vi: 'an yên' },
];

export const emotionTags = (l: Language) => EMOTION_TAGS.map((e) => pick(e, l));

/* ------------------------ Visualization scripts -------------------- */

export interface VizScript {
  id: string;
  title: Bi;
  theme: string; // gradient
  durations: number[]; // minutes
  steps: Bi[];
}

export const VIZ_SCRIPTS: VizScript[] = [
  {
    id: 'calm-anchor',
    title: { en: 'Calm anchor', vi: 'Điểm tựa bình an' },
    theme: 'from-indigo-500 to-violet-500',
    durations: [5, 10, 15, 30],
    steps: [
      { en: 'Settle in. Let your shoulders soften and your jaw release.', vi: 'Ngồi yên. Để vai buông lỏng và hàm thả lỏng.' },
      { en: 'Breathe in for four… and out for six.', vi: 'Hít vào đếm bốn… và thở ra đếm sáu.' },
      { en: 'Picture a place where you feel completely safe.', vi: 'Hình dung một nơi bạn cảm thấy hoàn toàn an toàn.' },
      { en: 'Notice the colours, the sounds, the warmth.', vi: 'Để ý màu sắc, âm thanh, hơi ấm.' },
      { en: 'Rest here. You are exactly where you need to be.', vi: 'Nghỉ ngơi ở đây. Bạn đang ở đúng nơi mình cần.' },
    ],
  },
  {
    id: 'future-rehearsal',
    title: { en: 'Future rehearsal', vi: 'Diễn tập tương lai' },
    theme: 'from-amber-400 to-orange-500',
    durations: [5, 10, 15, 30],
    steps: [
      { en: 'Imagine the day your desire is already real.', vi: 'Hình dung ngày mong ước của bạn đã là thật.' },
      { en: 'Where are you? What do you see first?', vi: 'Bạn đang ở đâu? Bạn thấy điều gì đầu tiên?' },
      { en: 'Feel the emotion of having it now — let it fill you.', vi: 'Cảm nhận cảm xúc khi đã có nó — để nó lấp đầy bạn.' },
      { en: 'Hear someone congratulate you. What do they say?', vi: 'Nghe ai đó chúc mừng bạn. Họ nói gì?' },
      { en: 'Carry this feeling with you as you return.', vi: 'Mang cảm giác này theo bạn khi trở về.' },
    ],
  },
  {
    id: 'abundance-flow',
    title: { en: 'Abundance flow', vi: 'Dòng chảy đủ đầy' },
    theme: 'from-emerald-400 to-teal-500',
    durations: [5, 10, 15, 30],
    steps: [
      { en: 'Breathe and feel how supported you already are.', vi: 'Hít thở và cảm nhận bạn đã được nâng đỡ thế nào.' },
      { en: 'Picture good things flowing toward you with ease.', vi: 'Hình dung điều tốt đẹp chảy về phía bạn dễ dàng.' },
      { en: 'Say silently: there is more than enough for me.', vi: 'Thầm nói: có nhiều hơn đủ dành cho tôi.' },
      { en: 'Open your hands. Allow yourself to receive.', vi: 'Mở rộng bàn tay. Cho phép mình được nhận.' },
    ],
  },
];

export const vizScript = (l: Language, s: VizScript) => ({
  ...s,
  titleText: pick(s.title, l),
  stepTexts: s.steps.map((x) => pick(x, l)),
});

/* --------------------------- Gratitude ----------------------------- */

export const GRATITUDE_BONUS_PROMPTS: Bi[] = [
  { en: 'Who made your day a little brighter?', vi: 'Ai khiến ngày của bạn tươi sáng hơn?' },
  { en: 'What small comfort did you enjoy?', vi: 'Niềm vui nhỏ nào bạn đã tận hưởng?' },
  { en: 'What does your body thank you for today?', vi: 'Hôm nay cơ thể biết ơn bạn vì điều gì?' },
];

/* --------------------------- Future self --------------------------- */

export const FUTURE_PROMPTS: Bi[] = [
  { en: 'Dear future me, here is what I am building for you...', vi: 'Gửi tôi của tương lai, đây là điều tôi đang xây cho bạn...' },
  { en: 'What advice would your future self give you today?', vi: 'Bản thân tương lai sẽ khuyên bạn điều gì hôm nay?' },
];
export const futurePrompt = (l: Language, i: number) => pick(FUTURE_PROMPTS[i % FUTURE_PROMPTS.length], l);
