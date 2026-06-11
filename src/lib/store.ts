import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import type {
  AppData, Settings, UserProfile, Affirmation, JournalEntry,
  FutureHorizon, ManifestationGoal, MoodEntry,
  VisualizationSession, VisionItem, CoachMessage,
  Method369Session, Phase369, LifeCategory, Scale5, EvidenceKind,
  Milestone, MediaBlob, Language, ThemeMode, ReminderPref,
} from './types';
import { dayKey } from './utils';
import {
  XP, type PracticeType, computeStreak, levelForXp,
} from './gamification';
import { BADGES } from './data/badges';

const DATA_VERSION = 1;

function defaultData(): AppData {
  const now = new Date().toISOString();
  return {
    version: DATA_VERSION,
    user: {
      id: nanoid(), name: '', avatarEmoji: '🌙', createdAt: now,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, xp: 0, level: 1,
    },
    settings: {
      language: 'en', theme: 'system', largeText: false, reduceMotion: false,
      soundEnabled: true, backgroundMusic: false, notificationsEnabled: false,
      reminders: [
        { id: nanoid(), kind: 'affirmation', time: '08:00', enabled: true },
        { id: nanoid(), kind: 'method369', time: '13:00', enabled: true },
        { id: nanoid(), kind: 'gratitude', time: '21:00', enabled: true },
      ],
    },
    affirmations: [], affirmationLogs: [], method369: [], method55x5: [],
    journal: [], gratitude: [], futureSelf: [], goals: [], evidence: [],
    moods: [], visualizations: [], visionBoards: [], achievements: [],
    streak: { current: 0, longest: 0 }, coach: [], media: [], activity: {},
  };
}

interface Store {
  data: AppData;
  hydrated: boolean;
  /* lifecycle */
  setHydrated: () => void;
  /* internal */
  _award: (type: PracticeType, day?: string) => void;
  /* settings + profile */
  setLanguage: (l: Language) => void;
  setTheme: (t: ThemeMode) => void;
  patchSettings: (p: Partial<Settings>) => void;
  setReminder: (r: ReminderPref) => void;
  setProfile: (p: Partial<UserProfile>) => void;
  completeOnboarding: (name: string, language: Language) => void;
  /* affirmations */
  addAffirmation: (text: string, category: LifeCategory) => void;
  deleteAffirmation: (id: string) => void;
  toggleFavorite: (id: string) => void;
  favoriteSeed: (text: string, category: LifeCategory) => void;
  logAffirmation: (id: string | null, text: string, category: LifeCategory, count: number, mirror: boolean) => void;
  /* 369 */
  ensure369: (intention: string, affirmation: string) => Method369Session;
  inc369: (phase: Phase369) => void;
  set369Meta: (intention: string, affirmation: string) => void;
  /* 55x5 */
  start55: (intention: string, affirmation: string) => void;
  log55: (runId: string, dayIndex: number, count: number) => void;
  /* journal */
  addJournal: (e: Pick<JournalEntry, 'kind' | 'title' | 'body' | 'emotions' | 'mood' | 'goalId' | 'tags'>) => void;
  updateJournal: (id: string, p: Partial<JournalEntry>) => void;
  deleteJournal: (id: string) => void;
  /* gratitude */
  saveGratitude: (items: string[], mood?: Scale5) => void;
  /* future self */
  addFutureLetter: (horizon: FutureHorizon, title: string, body: string) => void;
  addFutureTurn: (id: string, role: 'me' | 'future', text: string) => void;
  deleteFuture: (id: string) => void;
  /* goals */
  addGoal: (g: Omit<ManifestationGoal, 'id' | 'createdAt' | 'status' | 'milestones'> & { milestones?: string[] }) => void;
  updateGoal: (id: string, p: Partial<ManifestationGoal>) => void;
  deleteGoal: (id: string) => void;
  addMilestone: (goalId: string, title: string) => void;
  toggleMilestone: (goalId: string, mId: string) => void;
  achieveGoal: (id: string) => void;
  /* evidence */
  addEvidence: (e: { goalId?: string; kind: EvidenceKind; note: string; emotionalCharge: Scale5 }) => void;
  deleteEvidence: (id: string) => void;
  /* mood */
  addMood: (m: Omit<MoodEntry, 'id' | 'day' | 'createdAt'>) => void;
  /* visualization */
  completeVisualization: (s: Omit<VisualizationSession, 'id' | 'createdAt'>) => void;
  /* vision board */
  addBoard: (title: string, category: LifeCategory) => string;
  deleteBoard: (id: string) => void;
  addVisionItem: (boardId: string, image: string, caption: string) => void;
  moveVisionItem: (boardId: string, itemId: string, x: number, y: number) => void;
  updateVisionCaption: (boardId: string, itemId: string, caption: string) => void;
  deleteVisionItem: (boardId: string, itemId: string) => void;
  /* coach */
  newConversation: () => string;
  pushCoachMessage: (convId: string, msg: Omit<CoachMessage, 'id' | 'createdAt'>) => void;
  /* media */
  addMedia: (m: Omit<MediaBlob, 'id' | 'createdAt'>) => string;
  /* data */
  importData: (d: AppData) => void;
  resetAll: () => void;
}

export const useStore = create<Store>()(
  persist(
    immer((set, get) => ({
      data: defaultData(),
      hydrated: false,
      setHydrated: () => set((s) => { s.hydrated = true; }),

      _award: (type, day = dayKey()) =>
        set((s) => {
          const d = s.data;
          if (!d.activity[day]) d.activity[day] = [];
          if (!d.activity[day].includes(type)) d.activity[day].push(type);
          d.user.xp += XP[type];
          d.user.level = levelForXp(d.user.xp);
          d.streak = computeStreak(d.activity, dayKey());
          // refresh achievement progress + unlock timestamps
          for (const def of BADGES) {
            let a = d.achievements.find((x) => x.id === def.id);
            if (!a) { a = { id: def.id, progress: 0 }; d.achievements.push(a); }
            a.progress = def.progress(d);
            if (a.progress >= 1 && !a.unlockedAt) a.unlockedAt = new Date().toISOString();
          }
        }),

      setLanguage: (l) => set((s) => { s.data.settings.language = l; }),
      setTheme: (t) => set((s) => { s.data.settings.theme = t; }),
      patchSettings: (p) => set((s) => { Object.assign(s.data.settings, p); }),
      setReminder: (r) => set((s) => {
        const i = s.data.settings.reminders.findIndex((x) => x.id === r.id);
        if (i >= 0) s.data.settings.reminders[i] = r;
        else s.data.settings.reminders.push(r);
      }),
      setProfile: (p) => set((s) => { Object.assign(s.data.user, p); }),
      completeOnboarding: (name, language) => set((s) => {
        s.data.user.name = name.trim() || (language === 'vi' ? 'Bạn' : 'Friend');
        s.data.settings.language = language;
      }),

      addAffirmation: (text, category) => set((s) => {
        s.data.affirmations.unshift({
          id: nanoid(), text: text.trim(), category, isCustom: true,
          isFavorite: false, repetitions: 0, createdAt: new Date().toISOString(),
        });
      }),
      deleteAffirmation: (id) => set((s) => {
        s.data.affirmations = s.data.affirmations.filter((a) => a.id !== id);
      }),
      toggleFavorite: (id) => set((s) => {
        const a = s.data.affirmations.find((x) => x.id === id);
        if (a) a.isFavorite = !a.isFavorite;
      }),
      favoriteSeed: (text, category) => set((s) => {
        const exists = s.data.affirmations.find((a) => a.text === text);
        if (exists) { exists.isFavorite = !exists.isFavorite; return; }
        s.data.affirmations.unshift({
          id: nanoid(), text, category, isCustom: false, isFavorite: true,
          repetitions: 0, createdAt: new Date().toISOString(),
        });
      }),
      logAffirmation: (id, text, category, count, mirror) => {
        set((s) => {
          let aff: Affirmation | undefined = id ? s.data.affirmations.find((a) => a.id === id) : undefined;
          if (!aff) {
            aff = s.data.affirmations.find((a) => a.text === text);
          }
          if (!aff) {
            aff = { id: nanoid(), text, category, isCustom: false, isFavorite: false, repetitions: 0, createdAt: new Date().toISOString() };
            s.data.affirmations.unshift(aff);
          }
          aff.repetitions += count;
          s.data.affirmationLogs.unshift({
            id: nanoid(), affirmationId: aff.id, day: dayKey(), count,
            mirrorMode: mirror, createdAt: new Date().toISOString(),
          });
        });
        get()._award('affirmation');
      },

      ensure369: (intention, affirmation) => {
        const today = dayKey();
        let sess = get().data.method369.find((m) => m.day === today);
        if (!sess) {
          sess = {
            id: nanoid(), day: today, intention, affirmation,
            progress: { morning: 0, afternoon: 0, night: 0 }, completed: false,
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
          };
          set((s) => { s.data.method369.unshift(sess!); });
        }
        return sess;
      },
      set369Meta: (intention, affirmation) => set((s) => {
        const today = dayKey();
        const sess = s.data.method369.find((m) => m.day === today);
        if (sess) { sess.intention = intention; sess.affirmation = affirmation; sess.updatedAt = new Date().toISOString(); }
      }),
      inc369: (phase) => {
        const targets: Record<Phase369, number> = { morning: 3, afternoon: 6, night: 9 };
        set((s) => {
          const today = dayKey();
          const sess = s.data.method369.find((m) => m.day === today);
          if (!sess) return;
          if (sess.progress[phase] < targets[phase]) sess.progress[phase]++;
          sess.completed = (Object.keys(targets) as Phase369[]).every((p) => sess.progress[p] >= targets[p]);
          sess.updatedAt = new Date().toISOString();
        });
        const today = dayKey();
        const sess = get().data.method369.find((m) => m.day === today);
        if (sess?.completed) get()._award('method369');
      },

      start55: (intention, affirmation) => set((s) => {
        s.data.method55x5.unshift({
          id: nanoid(), intention, affirmation, startedAt: new Date().toISOString(),
          dayCounts: [0, 0, 0, 0, 0], completed: false,
        });
      }),
      log55: (runId, dayIndex, count) => {
        set((s) => {
          const run = s.data.method55x5.find((r) => r.id === runId);
          if (!run) return;
          run.dayCounts[dayIndex] = Math.min(55, count);
          run.completed = run.dayCounts.every((c) => c >= 55);
        });
        get()._award('method55x5');
      },

      addJournal: (e) => {
        set((s) => {
          s.data.journal.unshift({
            id: nanoid(), photoIds: [], ...e,
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
          });
        });
        get()._award('journal');
      },
      updateJournal: (id, p) => set((s) => {
        const j = s.data.journal.find((x) => x.id === id);
        if (j) { Object.assign(j, p); j.updatedAt = new Date().toISOString(); }
      }),
      deleteJournal: (id) => set((s) => {
        s.data.journal = s.data.journal.filter((j) => j.id !== id);
      }),

      saveGratitude: (items, mood) => {
        const today = dayKey();
        set((s) => {
          const existing = s.data.gratitude.find((g) => g.day === today);
          if (existing) { existing.items = items; existing.mood = mood; }
          else s.data.gratitude.unshift({ id: nanoid(), day: today, items, mood, createdAt: new Date().toISOString() });
        });
        get()._award('gratitude');
      },

      addFutureLetter: (horizon, title, body) => {
        set((s) => {
          s.data.futureSelf.unshift({ id: nanoid(), horizon, title, body, createdAt: new Date().toISOString() });
        });
        get()._award('futureSelf');
      },
      addFutureTurn: (id, role, text) => set((s) => {
        const l = s.data.futureSelf.find((x) => x.id === id);
        if (l) { l.conversation = l.conversation ?? []; l.conversation.push({ role, text }); }
      }),
      deleteFuture: (id) => set((s) => { s.data.futureSelf = s.data.futureSelf.filter((x) => x.id !== id); }),

      addGoal: (g) => {
        set((s) => {
          s.data.goals.unshift({
            id: nanoid(), status: 'active', createdAt: new Date().toISOString(),
            milestones: (g.milestones ?? []).map((t): Milestone => ({ id: nanoid(), title: t, done: false })),
            title: g.title, category: g.category, description: g.description,
            desiredOutcome: g.desiredOutcome, targetDate: g.targetDate,
            importance: g.importance, emotionalIntensity: g.emotionalIntensity,
          });
        });
        get()._award('goal');
      },
      updateGoal: (id, p) => set((s) => {
        const g = s.data.goals.find((x) => x.id === id);
        if (g) Object.assign(g, p);
      }),
      deleteGoal: (id) => set((s) => { s.data.goals = s.data.goals.filter((g) => g.id !== id); }),
      addMilestone: (goalId, title) => set((s) => {
        const g = s.data.goals.find((x) => x.id === goalId);
        if (g) g.milestones.push({ id: nanoid(), title, done: false });
      }),
      toggleMilestone: (goalId, mId) => set((s) => {
        const g = s.data.goals.find((x) => x.id === goalId);
        const m = g?.milestones.find((x) => x.id === mId);
        if (m) { m.done = !m.done; m.doneAt = m.done ? new Date().toISOString() : undefined; }
      }),
      achieveGoal: (id) => {
        set((s) => {
          const g = s.data.goals.find((x) => x.id === id);
          if (g) { g.status = 'achieved'; g.achievedAt = new Date().toISOString(); }
        });
        get()._award('goal');
      },

      addEvidence: (e) => {
        set((s) => {
          s.data.evidence.unshift({ id: nanoid(), createdAt: new Date().toISOString(), ...e });
        });
        get()._award('evidence');
      },
      deleteEvidence: (id) => set((s) => { s.data.evidence = s.data.evidence.filter((x) => x.id !== id); }),

      addMood: (m) => {
        const today = dayKey();
        set((s) => {
          const existing = s.data.moods.find((x) => x.day === today);
          if (existing) Object.assign(existing, m);
          else s.data.moods.unshift({ id: nanoid(), day: today, createdAt: new Date().toISOString(), ...m });
        });
        get()._award('mood');
      },

      completeVisualization: (sess) => {
        set((s) => {
          s.data.visualizations.unshift({ id: nanoid(), createdAt: new Date().toISOString(), ...sess });
        });
        if (sess.completed) get()._award('visualization');
      },

      addBoard: (title, category) => {
        const id = nanoid();
        set((s) => {
          s.data.visionBoards.unshift({ id, title, category, items: [], createdAt: new Date().toISOString() });
        });
        get()._award('vision');
        return id;
      },
      deleteBoard: (id) => set((s) => { s.data.visionBoards = s.data.visionBoards.filter((b) => b.id !== id); }),
      addVisionItem: (boardId, image, caption) => set((s) => {
        const b = s.data.visionBoards.find((x) => x.id === boardId);
        if (b) {
          const item: VisionItem = { id: nanoid(), image, caption, x: 8 + Math.random() * 60, y: 8 + Math.random() * 50 };
          b.items.push(item);
        }
      }),
      moveVisionItem: (boardId, itemId, x, y) => set((s) => {
        const it = s.data.visionBoards.find((b) => b.id === boardId)?.items.find((i) => i.id === itemId);
        if (it) { it.x = x; it.y = y; }
      }),
      updateVisionCaption: (boardId, itemId, caption) => set((s) => {
        const it = s.data.visionBoards.find((b) => b.id === boardId)?.items.find((i) => i.id === itemId);
        if (it) it.caption = caption;
      }),
      deleteVisionItem: (boardId, itemId) => set((s) => {
        const b = s.data.visionBoards.find((x) => x.id === boardId);
        if (b) b.items = b.items.filter((i) => i.id !== itemId);
      }),

      newConversation: () => {
        const id = nanoid();
        set((s) => {
          s.data.coach.unshift({ id, title: 'Session', messages: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        });
        return id;
      },
      pushCoachMessage: (convId, msg) => set((s) => {
        const c = s.data.coach.find((x) => x.id === convId);
        if (c) {
          c.messages.push({ id: nanoid(), createdAt: new Date().toISOString(), ...msg });
          c.updatedAt = new Date().toISOString();
          if (c.title === 'Session' && msg.role === 'user') c.title = msg.text.slice(0, 40);
        }
      }),

      addMedia: (m) => {
        const id = nanoid();
        set((s) => { s.data.media.push({ id, createdAt: new Date().toISOString(), ...m }); });
        return id;
      },

      importData: (d) => set((s) => { s.data = { ...defaultData(), ...d, version: DATA_VERSION }; }),
      resetAll: () => set((s) => { s.data = defaultData(); }),
    })),
    {
      name: 'manifest.v1',
      version: DATA_VERSION,
      partialize: (s) => ({ data: s.data }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

/* Stable selectors */
export const selectData = (s: Store) => s.data;
export const selectSettings = (s: Store) => s.data.settings;
export const useSettings = () => useStore(selectSettings);
export const useLang = () => useStore((s) => s.data.settings.language);
