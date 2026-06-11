import type { AppData, Language } from '../types';
import { AFFIRMATION_LIBRARY, affirmationText } from './affirmations';
import { randomScriptingPrompt } from './content';

/* ------------------------------------------------------------------ *
 * Local, rule-based manifestation coach.
 * Deliberately makes no supernatural claims — it reframes manifestation
 * as intention, focus, self-awareness, habit, and opportunity-spotting.
 * Designed so a real LLM call can replace `coachReply` later with the
 * same signature.
 * ------------------------------------------------------------------ */

type Bi = { en: string; vi: string };
const t = (b: Bi, l: Language) => (l === 'vi' ? b.vi : b.en);

const LIMITING_PATTERNS: { re: RegExp; reframe: Bi }[] = [
  {
    re: /\b(can't|cannot|never|impossible|too hard|no way)\b|không thể|chẳng bao giờ|vô vọng/i,
    reframe: {
      en: 'I noticed an absolute there — "never", "can\'t". Those words quietly close doors. What if we soften it to "I haven\'t yet, and I\'m learning how"? What is one small step that *is* possible this week?',
      vi: 'Mình để ý có một từ tuyệt đối — "không thể", "chẳng bao giờ". Những từ đó âm thầm đóng lại cánh cửa. Nếu đổi thành "mình chưa làm được, và đang học cách" thì sao? Một bước nhỏ *khả thi* trong tuần này là gì?',
    },
  },
  {
    re: /\b(not (good|smart|enough)|don't deserve|unworthy|失败)\b|không xứng|không đủ giỏi|không đủ tốt/i,
    reframe: {
      en: 'Worthiness isn\'t something you earn by performing — it\'s the starting point. Try this today: "I am already worthy; my actions express that, they don\'t prove it." How does that land?',
      vi: 'Sự xứng đáng không phải thứ phải chứng minh — nó là điểm bắt đầu. Hôm nay thử câu này: "Tôi vốn đã xứng đáng; hành động của tôi thể hiện điều đó, chứ không phải để chứng minh." Bạn thấy thế nào?',
    },
  },
];

const TOPIC_RESPONSES: { re: RegExp; cat: string; reply: Bi }[] = [
  {
    re: /money|wealth|rich|debt|tiền|giàu|nợ|tài chính/i,
    cat: 'wealth',
    reply: {
      en: 'Money goals get clearer with a number and a feeling. What specific amount, by when — and how will having it feel in your body? Let\'s anchor that feeling daily.',
      vi: 'Mục tiêu về tiền rõ hơn khi có con số và cảm giác. Con số cụ thể là bao nhiêu, đến khi nào — và cảm giác trong cơ thể khi có nó ra sao? Hãy neo cảm giác đó mỗi ngày.',
    },
  },
  {
    re: /love|relationship|partner|lonely|tình yêu|người yêu|cô đơn|mối quan hệ/i,
    cat: 'love',
    reply: {
      en: 'The relationship you want starts as the relationship you have with yourself. What would the most loved version of you do differently this week?',
      vi: 'Mối quan hệ bạn mong muốn bắt đầu từ mối quan hệ với chính mình. Phiên bản được yêu thương nhất của bạn sẽ làm gì khác trong tuần này?',
    },
  },
  {
    re: /job|career|interview|promotion|work|công việc|sự nghiệp|phỏng vấn|thăng chức/i,
    cat: 'career',
    reply: {
      en: 'Let\'s turn this into focus + action. Picture the role as already yours — then name one move (a message, an application, a skill) that your future self would make today.',
      vi: 'Hãy biến điều này thành tập trung + hành động. Hình dung vị trí đó đã là của bạn — rồi nêu một việc (một tin nhắn, một đơn ứng tuyển, một kỹ năng) mà bạn của tương lai sẽ làm hôm nay.',
    },
  },
  {
    re: /stress|anxious|overwhelm|tired|burnt|căng thẳng|lo lắng|mệt|kiệt sức/i,
    cat: 'health',
    reply: {
      en: 'Thank you for being honest about that. Before any manifesting, your nervous system needs safety. Try one slow breath cycle with me — in for 4, out for 6 — then we continue gently.',
      vi: 'Cảm ơn bạn đã thành thật. Trước mọi việc, hệ thần kinh của bạn cần sự an toàn. Thử một nhịp thở chậm cùng mình — hít vào 4, thở ra 6 — rồi ta tiếp tục nhẹ nhàng.',
    },
  },
];

const ENCOURAGE: Bi[] = [
  { en: 'I hear you. Tell me a little more — what would "this going well" actually look like?', vi: 'Mình hiểu. Kể thêm chút nhé — "mọi việc suôn sẻ" thực sự trông như thế nào?' },
  { en: 'That\'s a meaningful thing to want. What\'s drawing you toward it right now?', vi: 'Đó là điều đáng để mong muốn. Điều gì đang kéo bạn về phía nó lúc này?' },
  { en: 'Let\'s make it vivid. If it were already true, what is the first thing you\'d notice tomorrow morning?', vi: 'Hãy làm cho nó sống động. Nếu điều đó đã là thật, sáng mai bạn nhận ra điều gì đầu tiên?' },
];

function streakNote(d: AppData, l: Language): string | null {
  if (d.streak.current >= 3) {
    return t({ en: ` And by the way — ${d.streak.current} days in a row. That consistency is the real magic. 🔥`, vi: ` Nhân tiện — ${d.streak.current} ngày liên tiếp rồi. Sự đều đặn đó mới là phép màu thật sự. 🔥` }, l);
  }
  return null;
}

export function coachReply(input: string, data: AppData, lang: Language): string {
  const text = input.trim();
  if (!text) return t(ENCOURAGE[0], lang);

  for (const p of LIMITING_PATTERNS) {
    if (p.re.test(text)) return t(p.reframe, lang) + (streakNote(data, lang) ?? '');
  }
  for (const topic of TOPIC_RESPONSES) {
    if (topic.re.test(text)) {
      const aff = AFFIRMATION_LIBRARY.find((a) => a.category === topic.cat);
      const suffix = aff
        ? t({ en: ` Try carrying this today: "${affirmationText(aff, lang)}"`, vi: ` Hôm nay thử mang theo câu này: "${affirmationText(aff, lang)}"` }, lang)
        : '';
      return t(topic.reply, lang) + suffix + (streakNote(data, lang) ?? '');
    }
  }
  const base = t(ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)], lang);
  return base + (streakNote(data, lang) ?? '');
}

export function coachSuggestAffirmation(data: AppData, lang: Language): string {
  const cat = data.goals[0]?.category;
  const pool = cat ? AFFIRMATION_LIBRARY.filter((a) => a.category === cat) : AFFIRMATION_LIBRARY;
  const a = (pool.length ? pool : AFFIRMATION_LIBRARY)[Math.floor(Math.random() * (pool.length || AFFIRMATION_LIBRARY.length))];
  return t(
    {
      en: `Here's one shaped for you: "${affirmationText(a, lang)}" — say it slowly three times and feel each word.`,
      vi: `Đây là một câu dành cho bạn: "${affirmationText(a, lang)}" — đọc chậm ba lần và cảm nhận từng chữ.`,
    },
    lang,
  );
}

export function coachSpotLimiting(lang: Language): string {
  return t(
    {
      en: 'Tell me a sentence that starts with "I can\'t…" or "I\'m not…". Whatever follows is usually the belief worth gently questioning together.',
      vi: 'Hãy nói một câu bắt đầu bằng "Tôi không thể…" hoặc "Tôi không phải là…". Điều theo sau thường là niềm tin đáng để cùng nhau xem lại nhẹ nhàng.',
    },
    lang,
  );
}

export function coachScriptingPrompt(lang: Language): string {
  return t(
    { en: `Scripting prompt: ${randomScriptingPrompt(lang)} Write it in present tense, as if it already happened.`, vi: `Gợi ý viết kịch bản: ${randomScriptingPrompt(lang)} Viết ở thì hiện tại, như thể đã xảy ra.` },
    lang,
  );
}
