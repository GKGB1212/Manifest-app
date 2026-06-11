import type { Language } from './types';

/* ------------------------------------------------------------------ *
 * Lightweight i18n. Each key maps to an [English, Vietnamese] tuple.
 * Strings may contain {name}-style placeholders interpolated by t().
 * Kept framework-agnostic; the React hook lives in hooks/useT.
 * ------------------------------------------------------------------ */

type Dict = Record<string, readonly [string, string]>;

export const dict = {
  appName: ['Manifest', 'Manifest'],
  tagline: [
    'Your calm, daily manifestation practice',
    'Thực hành manifestation mỗi ngày, an yên',
  ],

  // Navigation
  'nav.today': ['Today', 'Hôm nay'],
  'nav.affirmations': ['Affirmations', 'Khẳng định'],
  'nav.methods': ['Methods', 'Phương pháp'],
  'nav.journal': ['Journal', 'Nhật ký'],
  'nav.gratitude': ['Gratitude', 'Biết ơn'],
  'nav.goals': ['Goals', 'Mục tiêu'],
  'nav.vision': ['Vision Board', 'Bảng tầm nhìn'],
  'nav.visualize': ['Visualize', 'Thiền hình dung'],
  'nav.mood': ['Mood', 'Cảm xúc'],
  'nav.futureSelf': ['Future Self', 'Bản thân tương lai'],
  'nav.coach': ['AI Coach', 'Huấn luyện viên AI'],
  'nav.analytics': ['Insights', 'Phân tích'],
  'nav.achievements': ['Achievements', 'Thành tựu'],
  'nav.settings': ['Settings', 'Cài đặt'],
  'nav.groups.practice': ['Practice', 'Thực hành'],
  'nav.groups.reflect': ['Reflect', 'Chiêm nghiệm'],
  'nav.groups.grow': ['Grow', 'Phát triển'],

  // Common
  'common.save': ['Save', 'Lưu'],
  'common.cancel': ['Cancel', 'Hủy'],
  'common.delete': ['Delete', 'Xóa'],
  'common.edit': ['Edit', 'Sửa'],
  'common.add': ['Add', 'Thêm'],
  'common.done': ['Done', 'Xong'],
  'common.close': ['Close', 'Đóng'],
  'common.next': ['Next', 'Tiếp'],
  'common.back': ['Back', 'Quay lại'],
  'common.start': ['Start', 'Bắt đầu'],
  'common.continue': ['Continue', 'Tiếp tục'],
  'common.today': ['Today', 'Hôm nay'],
  'common.all': ['All', 'Tất cả'],
  'common.search': ['Search', 'Tìm kiếm'],
  'common.optional': ['optional', 'không bắt buộc'],
  'common.streak': ['{n}-day streak', 'Chuỗi {n} ngày'],
  'common.day': ['Day', 'Ngày'],
  'common.completed': ['Completed', 'Hoàn thành'],
  'common.empty': ['Nothing here yet', 'Chưa có gì ở đây'],
  'common.reps': ['reps', 'lần'],
  'common.minutes': ['min', 'phút'],
  'common.level': ['Level', 'Cấp'],
  'common.xp': ['XP', 'Điểm'],
  'common.viewAll': ['View all', 'Xem tất cả'],
  'common.greatJob': ['Beautifully done', 'Tuyệt vời'],

  // Greetings (time-of-day)
  'greet.morning': ['Good morning', 'Chào buổi sáng'],
  'greet.afternoon': ['Good afternoon', 'Chào buổi chiều'],
  'greet.evening': ['Good evening', 'Chào buổi tối'],
  'greet.night': ['Resting well', 'Đêm an lành'],

  // Dashboard
  'dash.todaysIntention': ["Today's focus", 'Tâm điểm hôm nay'],
  'dash.dailyPractice': ['Daily practice', 'Thực hành hôm nay'],
  'dash.ringTitle': ['Practice rings', 'Vòng thực hành'],
  'dash.completedOf': ['{done} of {total} complete', '{done}/{total} hoàn tất'],
  'dash.affirmationOfDay': ['Affirmation of the day', 'Câu khẳng định hôm nay'],
  'dash.moodToday': ['How are you today?', 'Hôm nay bạn thế nào?'],
  'dash.checkIn': ['Check in', 'Ghi nhận'],
  'dash.recentEvidence': ['Recent evidence', 'Dấu hiệu gần đây'],
  'dash.quickAdd': ['Quick add', 'Thêm nhanh'],
  'dash.keepGoing': ['Keep your streak alive', 'Giữ chuỗi ngày của bạn'],
  'dash.statGoals': ['Active goals', 'Mục tiêu đang theo'],
  'dash.statEvidence': ['Evidence logged', 'Dấu hiệu đã ghi'],
  'dash.statSessions': ['Sessions', 'Phiên'],

  // Affirmations
  'aff.title': ['Affirmations', 'Câu khẳng định'],
  'aff.subtitle': [
    'Reprogram self-talk through deliberate, felt repetition.',
    'Tái lập trình lời tự nhủ qua sự lặp lại có chủ đích và cảm xúc.',
  ],
  'aff.daily': ['Daily', 'Hằng ngày'],
  'aff.favorites': ['Favorites', 'Yêu thích'],
  'aff.mine': ['My affirmations', 'Của tôi'],
  'aff.newAffirmation': ['New affirmation', 'Khẳng định mới'],
  'aff.placeholder': [
    'I am calm, capable, and worthy of good things…',
    'Tôi bình an, đủ đầy và xứng đáng với điều tốt đẹp…',
  ],
  'aff.repeat': ['Repeat', 'Lặp lại'],
  'aff.mirrorMode': ['Mirror mode', 'Chế độ gương'],
  'aff.mirrorHint': [
    'Speak to yourself in the mirror — eye contact deepens belief.',
    'Nói với chính mình trong gương — giao tiếp bằng mắt giúp tin sâu hơn.',
  ],
  'aff.tapToCount': ['Tap to count', 'Chạm để đếm'],
  'aff.repsToday': ['{n} today', '{n} hôm nay'],
  'aff.totalReps': ['{n} total', 'Tổng {n}'],

  // Methods
  'methods.title': ['Manifestation methods', 'Các phương pháp manifestation'],
  'm369.title': ['369 Method', 'Phương pháp 369'],
  'm369.desc': [
    'Write your desire 3× morning, 6× afternoon, 9× night to anchor focus.',
    'Viết mong ước 3 lần sáng, 6 lần chiều, 9 lần tối để neo sự tập trung.',
  ],
  'm369.intention': ['Your intention', 'Ý định của bạn'],
  'm369.affirmation': ['Affirmation to write', 'Câu để viết'],
  'm369.morning': ['Morning · 3×', 'Sáng · 3×'],
  'm369.afternoon': ['Afternoon · 6×', 'Chiều · 6×'],
  'm369.night': ['Night · 9×', 'Tối · 9×'],
  'm369.writeHere': ['Write it here…', 'Viết vào đây…'],
  'm369.allDone': ["Today's 369 is complete 🌙", 'Hoàn thành 369 hôm nay 🌙'],
  'm55.title': ['55×5 Method', 'Phương pháp 55×5'],
  'm55.desc': [
    'Write one affirmation 55 times a day for 5 days.',
    'Viết một câu khẳng định 55 lần mỗi ngày trong 5 ngày.',
  ],
  'm55.dayOf': ['Day {n} of 5', 'Ngày {n}/5'],
  'm55.count': ['{n} / 55 today', '{n}/55 hôm nay'],
  'm55.newRun': ['Start a 5-day run', 'Bắt đầu 5 ngày'],

  // Journal / scripting
  'journal.title': ['Journal', 'Nhật ký'],
  'journal.scripting': ['Scripting', 'Viết kịch bản'],
  'journal.scriptingHint': [
    'Write as if it already happened. Feel the detail.',
    'Viết như thể điều đó đã xảy ra. Cảm nhận từng chi tiết.',
  ],
  'journal.new': ['New entry', 'Bài viết mới'],
  'journal.titlePlaceholder': ['Give it a title…', 'Đặt tiêu đề…'],
  'journal.bodyPlaceholder': [
    'Today I woke up in my dream home and felt…',
    'Hôm nay tôi thức dậy trong ngôi nhà mơ ước và cảm thấy…',
  ],
  'journal.emotions': ['How does it feel?', 'Bạn cảm thấy thế nào?'],
  'journal.templates': ['Templates', 'Mẫu'],
  'journal.aiPrompt': ['Need a spark?', 'Cần gợi ý?'],
  'journal.suggest': ['Suggest a prompt', 'Gợi ý cho tôi'],

  // Gratitude
  'grat.title': ['Gratitude', 'Lòng biết ơn'],
  'grat.subtitle': [
    'Three good things rewires attention toward abundance.',
    'Ba điều tốt đẹp giúp tâm trí hướng về sự đủ đầy.',
  ],
  'grat.q1': ['What went well today?', 'Hôm nay điều gì diễn ra tốt đẹp?'],
  'grat.q2': ['What are you grateful for?', 'Bạn biết ơn điều gì?'],
  'grat.q3': ['What surprised you positively?', 'Điều bất ngờ dễ chịu nào đã đến?'],
  'grat.savedToday': ['Saved for today 🌼', 'Đã lưu hôm nay 🌼'],
  'grat.entries': ['{n} entries', '{n} bài'],

  // Future self
  'future.title': ['Future Self', 'Bản thân tương lai'],
  'future.subtitle': [
    'Meet who you are becoming. Write to them, hear back.',
    'Gặp con người bạn đang trở thành. Viết thư và lắng nghe.',
  ],
  'future.letter': ['Write a letter', 'Viết một lá thư'],
  'future.6m': ['6 months', '6 tháng'],
  'future.1y': ['1 year', '1 năm'],
  'future.5y': ['5 years', '5 năm'],
  'future.converse': ['Have a conversation', 'Trò chuyện'],

  // Goals
  'goals.title': ['Manifestation goals', 'Mục tiêu manifestation'],
  'goals.new': ['New goal', 'Mục tiêu mới'],
  'goals.desiredOutcome': ['Desired outcome', 'Kết quả mong muốn'],
  'goals.targetDate': ['Target date', 'Ngày mục tiêu'],
  'goals.importance': ['Importance', 'Mức quan trọng'],
  'goals.emotion': ['Emotional intensity', 'Cường độ cảm xúc'],
  'goals.milestones': ['Milestones', 'Cột mốc'],
  'goals.timeline': ['Timeline', 'Dòng thời gian'],
  'goals.evidence': ['Evidence', 'Dấu hiệu'],
  'goals.addEvidence': ['Log evidence', 'Ghi dấu hiệu'],
  'goals.markAchieved': ['Mark achieved', 'Đánh dấu đạt được'],
  'goals.achieved': ['Achieved', 'Đã đạt được'],
  'goals.evidencePlaceholder': [
    'I got invited to an interview…',
    'Tôi được mời phỏng vấn…',
  ],
  'goals.tl.created': ['Goal created', 'Tạo mục tiêu'],
  'goals.tl.achieved': ['Achieved!', 'Đạt được!'],

  // Vision board
  'vision.title': ['Vision Board', 'Bảng tầm nhìn'],
  'vision.new': ['New board', 'Bảng mới'],
  'vision.addImage': ['Add image', 'Thêm ảnh'],
  'vision.dragHint': ['Drag images to arrange', 'Kéo ảnh để sắp xếp'],
  'vision.empty': [
    'Add images that represent your desire.',
    'Thêm hình ảnh thể hiện mong ước của bạn.',
  ],

  // Visualization
  'viz.title': ['Visualization', 'Thiền hình dung'],
  'viz.subtitle': [
    'Guided sessions to rehearse your reality with all senses.',
    'Phiên hướng dẫn để diễn tập thực tại bằng mọi giác quan.',
  ],
  'viz.breatheIn': ['Breathe in', 'Hít vào'],
  'viz.breatheOut': ['Breathe out', 'Thở ra'],
  'viz.sessionComplete': ['Session complete', 'Hoàn thành phiên'],

  // Mood
  'mood.title': ['Mood & energy', 'Cảm xúc & năng lượng'],
  'mood.subtitle': [
    'A 20-second check-in builds self-awareness over time.',
    'Ghi nhận 20 giây giúp bạn hiểu mình hơn theo thời gian.',
  ],
  'mood.mood': ['Mood', 'Tâm trạng'],
  'mood.energy': ['Energy', 'Năng lượng'],
  'mood.confidence': ['Confidence', 'Tự tin'],
  'mood.stress': ['Stress', 'Căng thẳng'],
  'mood.gratitude': ['Gratitude', 'Biết ơn'],
  'mood.selfBelief': ['Self-belief', 'Niềm tin vào bản thân'],
  'mood.note': ['Anything on your mind?', 'Điều gì trong tâm trí bạn?'],
  'mood.trends': ['Your trends', 'Xu hướng của bạn'],
  'mood.saved': ['Check-in saved 💜', 'Đã ghi nhận 💜'],

  // Coach
  'coach.title': ['AI Coach', 'Huấn luyện viên AI'],
  'coach.subtitle': [
    'A supportive guide for clarity, focus, and consistency.',
    'Người đồng hành giúp bạn rõ ràng, tập trung và kiên trì.',
  ],
  'coach.placeholder': ['Share what is on your mind…', 'Chia sẻ điều bạn đang nghĩ…'],
  'coach.send': ['Send', 'Gửi'],
  'coach.intro': [
    "Hi, I'm here to help you clarify what you want and stay consistent. What would you like to focus on today?",
    'Chào bạn, mình ở đây để giúp bạn làm rõ mong muốn và giữ sự kiên trì. Hôm nay bạn muốn tập trung vào điều gì?',
  ],
  'coach.suggest.affirmation': ['Suggest an affirmation', 'Gợi ý câu khẳng định'],
  'coach.suggest.limiting': ['Spot a limiting belief', 'Tìm niềm tin giới hạn'],
  'coach.suggest.scripting': ['Give me a scripting prompt', 'Gợi ý viết kịch bản'],
  'coach.disclaimer': [
    'Guidance only — manifestation here means intention, focus, and action.',
    'Chỉ mang tính đồng hành — manifestation ở đây là ý định, tập trung và hành động.',
  ],

  // Analytics
  'analytics.title': ['Insights', 'Phân tích'],
  'analytics.consistency': ['Consistency', 'Sự đều đặn'],
  'analytics.practiceMix': ['Practice mix', 'Cơ cấu thực hành'],
  'analytics.moodTrend': ['Mood & self-belief', 'Tâm trạng & niềm tin'],
  'analytics.activity': ['30-day activity', 'Hoạt động 30 ngày'],
  'analytics.bestStreak': ['Longest streak', 'Chuỗi dài nhất'],
  'analytics.totalPractices': ['Total practices', 'Tổng số lần thực hành'],

  // Achievements
  'ach.title': ['Achievements', 'Thành tựu'],
  'ach.subtitle': ['Celebrate the consistency you are building.', 'Ăn mừng sự kiên trì của bạn.'],
  'ach.unlocked': ['Unlocked', 'Đã mở khóa'],
  'ach.locked': ['Locked', 'Chưa mở'],

  // Settings
  'set.title': ['Settings', 'Cài đặt'],
  'set.language': ['Language', 'Ngôn ngữ'],
  'set.appearance': ['Appearance', 'Giao diện'],
  'set.theme': ['Theme', 'Chủ đề'],
  'set.themeSystem': ['System', 'Hệ thống'],
  'set.themeLight': ['Light', 'Sáng'],
  'set.themeDark': ['Dark', 'Tối'],
  'set.accessibility': ['Accessibility', 'Trợ năng'],
  'set.largeText': ['Larger text', 'Chữ lớn hơn'],
  'set.reduceMotion': ['Reduce motion', 'Giảm chuyển động'],
  'set.sound': ['Sound effects', 'Hiệu ứng âm thanh'],
  'set.music': ['Background music', 'Nhạc nền'],
  'set.notifications': ['Notifications', 'Thông báo'],
  'set.reminders': ['Reminders', 'Lời nhắc'],
  'set.data': ['Your data', 'Dữ liệu của bạn'],
  'set.exportJson': ['Export JSON', 'Xuất JSON'],
  'set.exportCsv': ['Export CSV', 'Xuất CSV'],
  'set.exportPdf': ['Export report (PDF)', 'Xuất báo cáo (PDF)'],
  'set.import': ['Import backup', 'Nhập sao lưu'],
  'set.reset': ['Reset all data', 'Xóa toàn bộ dữ liệu'],
  'set.resetConfirm': [
    'This permanently deletes everything on this device. Continue?',
    'Thao tác này xóa vĩnh viễn mọi dữ liệu trên thiết bị. Tiếp tục?',
  ],
  'set.profile': ['Profile', 'Hồ sơ'],
  'set.name': ['Name', 'Tên'],
  'set.about': ['About', 'Giới thiệu'],
  'set.aboutBody': [
    'Manifest is a local-first practice companion. Your data stays on your device.',
    'Manifest là người bạn đồng hành lưu dữ liệu ngay trên thiết bị của bạn.',
  ],

  // Categories
  'cat.wealth': ['Wealth', 'Tài lộc'],
  'cat.career': ['Career', 'Sự nghiệp'],
  'cat.confidence': ['Confidence', 'Tự tin'],
  'cat.love': ['Love', 'Tình yêu'],
  'cat.health': ['Health', 'Sức khỏe'],
  'cat.spirituality': ['Spirituality', 'Tâm linh'],
  'cat.lifestyle': ['Lifestyle', 'Lối sống'],
  'cat.travel': ['Travel', 'Du lịch'],
  'cat.relationship': ['Relationship', 'Mối quan hệ'],
  'cat.finance': ['Finance', 'Tài chính'],

  // Evidence kinds
  'ev.sign': ['Sign', 'Dấu hiệu'],
  'ev.synchronicity': ['Synchronicity', 'Trùng hợp'],
  'ev.win': ['Small win', 'Chiến thắng nhỏ'],
  'ev.opportunity': ['Opportunity', 'Cơ hội'],
  'ev.progress': ['Progress', 'Tiến triển'],

  // Onboarding
  'onb.welcome': ['Welcome to Manifest', 'Chào mừng đến với Manifest'],
  'onb.intro': [
    'A calm space to clarify desires, build belief, and stay consistent.',
    'Một không gian an yên để làm rõ mong ước, nuôi niềm tin và giữ sự kiên trì.',
  ],
  'onb.yourName': ['What should we call you?', 'Chúng tôi nên gọi bạn là gì?'],
  'onb.begin': ['Begin practice', 'Bắt đầu thực hành'],
} as const satisfies Dict;

export type TKey = keyof typeof dict;

export function translate(
  lang: Language,
  key: TKey,
  vars?: Record<string, string | number>,
): string {
  const entry = dict[key];
  let s: string = entry ? entry[lang === 'vi' ? 1 : 0] : key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return s;
}

export function detectLanguage(): Language {
  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('vi')) {
    return 'vi';
  }
  return 'en';
}
