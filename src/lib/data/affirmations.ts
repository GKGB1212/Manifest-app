import type { LifeCategory, Language } from '../types';

export interface AffirmationSeed {
  id: string;
  category: LifeCategory;
  en: string;
  vi: string;
}

/** A curated, present-tense, identity-based affirmation library. */
export const AFFIRMATION_LIBRARY: AffirmationSeed[] = [
  // Wealth / finance
  { id: 'w1', category: 'wealth', en: 'Money flows to me easily and I use it wisely.', vi: 'Tiền bạc đến với tôi dễ dàng và tôi dùng nó khôn ngoan.' },
  { id: 'w2', category: 'wealth', en: 'I am a magnet for opportunities that grow my wealth.', vi: 'Tôi thu hút những cơ hội giúp tài sản của mình lớn lên.' },
  { id: 'w3', category: 'finance', en: 'I am calm and confident with my finances.', vi: 'Tôi bình tĩnh và tự tin với tài chính của mình.' },
  { id: 'w4', category: 'finance', en: 'Every day my savings grow and my worries shrink.', vi: 'Mỗi ngày tiền tiết kiệm tăng lên và lo lắng vơi đi.' },
  // Career
  { id: 'c1', category: 'career', en: 'I do work that matters and it is recognised.', vi: 'Tôi làm công việc ý nghĩa và được ghi nhận.' },
  { id: 'c2', category: 'career', en: 'The right opportunities find me at the right time.', vi: 'Cơ hội đúng đến với tôi vào đúng thời điểm.' },
  { id: 'c3', category: 'career', en: 'I lead with clarity, courage, and calm.', vi: 'Tôi dẫn dắt với sự rõ ràng, can đảm và điềm tĩnh.' },
  // Confidence
  { id: 'cf1', category: 'confidence', en: 'I am calm, capable, and worthy of good things.', vi: 'Tôi bình an, đủ năng lực và xứng đáng với điều tốt đẹp.' },
  { id: 'cf2', category: 'confidence', en: 'I trust myself to handle whatever comes.', vi: 'Tôi tin mình có thể đối mặt với mọi điều xảy đến.' },
  { id: 'cf3', category: 'confidence', en: 'My voice matters and I share it freely.', vi: 'Tiếng nói của tôi có giá trị và tôi tự do thể hiện.' },
  // Love / relationship
  { id: 'l1', category: 'love', en: 'I am worthy of deep, gentle, lasting love.', vi: 'Tôi xứng đáng với một tình yêu sâu sắc, dịu dàng và bền lâu.' },
  { id: 'l2', category: 'love', en: 'I give and receive love with an open heart.', vi: 'Tôi cho và nhận yêu thương bằng một trái tim rộng mở.' },
  { id: 'r1', category: 'relationship', en: 'I attract relationships that feel safe and kind.', vi: 'Tôi thu hút những mối quan hệ an toàn và tử tế.' },
  // Health
  { id: 'h1', category: 'health', en: 'My body is strong, rested, and full of energy.', vi: 'Cơ thể tôi khỏe mạnh, được nghỉ ngơi và tràn năng lượng.' },
  { id: 'h2', category: 'health', en: 'I treat my body with care and it thanks me.', vi: 'Tôi chăm sóc cơ thể và nó đáp lại bằng sự khỏe khoắn.' },
  // Spirituality
  { id: 's1', category: 'spirituality', en: 'I am exactly where I need to be right now.', vi: 'Tôi đang ở đúng nơi mình cần ngay lúc này.' },
  { id: 's2', category: 'spirituality', en: 'I trust the timing of my life.', vi: 'Tôi tin vào nhịp điệu của cuộc đời mình.' },
  // Lifestyle / travel
  { id: 'ls1', category: 'lifestyle', en: 'I design a life that feels spacious and free.', vi: 'Tôi kiến tạo một cuộc sống rộng rãi và tự do.' },
  { id: 't1', category: 'travel', en: 'The world opens to me and I explore with joy.', vi: 'Thế giới rộng mở và tôi khám phá trong niềm vui.' },
];

export const affirmationText = (a: AffirmationSeed, lang: Language) =>
  lang === 'vi' ? a.vi : a.en;

/** Deterministic daily pick so the "affirmation of the day" is stable. */
export function affirmationOfDay(dayIndex: number): AffirmationSeed {
  return AFFIRMATION_LIBRARY[dayIndex % AFFIRMATION_LIBRARY.length];
}
