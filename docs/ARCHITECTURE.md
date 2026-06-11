# Manifest — Architecture

A calm, bilingual (🇬🇧 EN / 🇻🇳 VI), local-first **manifestation ecosystem**.
Built to genuinely move the psychology levers that matter: clarity, belief,
consistency, self-awareness, emotional regulation, and opportunity recognition.

> **Stack decision.** The original spec asked for Next.js + Postgres + Prisma +
> Clerk. The repo already contained a Vite + React 19 scaffold, and a
> server-rendered app can't run without a database, auth keys, and hosting. To
> ship something that **runs the instant you `pnpm dev`**, this is built as a
> local-first SPA with all state persisted on-device. A `prisma/schema.prisma`
> mirrors the domain model 1:1, and all writes flow through the Zustand store
> (`src/lib/store.ts`) — the single seam where a REST/tRPC backend slots in
> later without touching a single component.

## Product surface

| Area | Route | What it does |
| --- | --- | --- |
| Today | `/` | Greeting, daily practice rings, affirmation of the day, streak, level, quick-add, recent evidence |
| Affirmations | `/affirmations` | Library + custom, categories, favorites, **mirror mode** (front camera), tap-to-count repetition + completion tracking, TTS |
| Methods | `/methods` | **369** (3/6/9 morning-afternoon-night guided workflow, streaks, history) and **55×5** (auto counter, 5-day tracking) |
| Visualize | `/visualize` | Guided sessions (5/10/15/30 min), breathing animation, step narration, session history |
| Journal | `/journal` | Scripting / free / reflection, templates, AI prompt injection, emotion tagging, mood, goal linking, search & filter |
| Gratitude | `/gratitude` | Three rotating prompts, gratitude streak, mood, history |
| Mood | `/mood` | 6-dimension check-in (mood, energy, confidence, stress, gratitude, self-belief) + trend charts |
| Future Self | `/future` | Letters across 6m / 1y / 5y, plus conversations with your future self |
| Goals | `/goals` | Goal + desired outcome + importance/emotional intensity, milestones, **evidence log**, **visual timeline**, achievement |
| Vision Board | `/vision` | Boards by category, image upload, drag-to-arrange, captions |
| Coach | `/coach` | Local supportive AI: reframes limiting beliefs, suggests affirmations & scripting prompts, celebrates streaks. Never makes supernatural claims |
| Insights | `/insights` | Consistency %, 30-day heatmap, practice-mix donut, mood/self-belief area chart |
| Achievements | `/achievements` | XP, levels, badges with live progress |
| Settings | `/settings` | Language, theme, accessibility, reminders, JSON/CSV/PDF export, import, reset |

## Folder structure

```
src/
  lib/
    types.ts          # domain model — single source of truth
    store.ts          # Zustand + immer + persist; all mutations + XP/streak/badge engine
    gamification.ts   # XP table, level curve, streak computation, daily rings
    i18n.ts           # EN/VI dictionary + translate()
    utils.ts          # day keys, dates, formatting, file/download helpers
    export.ts         # JSON / CSV / PDF exporters
    data/             # static content: affirmation library, categories,
                      #   visualization scripts, journal templates, badges, coach logic
  hooks/
    useT.ts           # translator bound to active language
    useTheme.ts       # applies theme + a11y prefs to <html>
  components/
    ui/               # design-system primitives (Button, Card, GlassCard,
                      #   ProgressRing, Modal, Toast, Field/Segmented/ScaleSelector)
    layout/           # AppShell, Sidebar, TopBar, BottomNav, nav config
    CategoryPicker.tsx
  features/<area>/    # one folder per product surface, lazy-loaded route
  App.tsx             # onboarding gate + router
  index.css           # design tokens, glassmorphism, dark mode, motion
prisma/schema.prisma  # production Postgres schema (indexes + relations)
```

## Data flow

```
Component ──action──▶ useStore (Zustand)
                         │ immer mutation
                         ▼
                 _award(practice, day)
                  ├─ records activity[day]
                  ├─ grants XP → recomputes level
                  ├─ recomputes streak (current + longest)
                  └─ refreshes badge progress + unlock timestamps
                         │
                  persist middleware ──▶ localStorage ("manifest.v1")
```

Because every practice routes through `_award`, gamification, streaks, the
Today rings, and Insights stay consistent automatically — add a feature, call
`_award('type')`, and it shows up everywhere.

## Design system

- **Palette:** deep indigo `#4F46E5`, soft lavender `#A78BFA`, light purple
  `#C4B5FD`, warm white `#FAFAFA`, gold reward `#FBBF24`, growth green
  `#22C55E`. Mood colors are calm; no harsh reds.
- **Surfaces:** glassmorphism (`.glass`), soft shadows, 24px radii, gradient
  hero, ambient blurred orbs.
- **Motion:** Framer Motion page transitions, ring fills, staggered cards,
  breathing animations — all disabled under `prefers-reduced-motion` and the
  in-app **Reduce motion** toggle.
- **Accessibility:** dark mode, **large-text** scaling, focus-visible rings,
  `aria-label`s, `role="switch"`/`role="dialog"`, screen-reader-friendly
  controls, WCAG-AA-minded contrast.

## Swapping in a real backend

1. `pnpm prisma migrate dev` against `prisma/schema.prisma`.
2. Build an API (REST/tRPC) whose resources map to the store actions.
3. Replace the bodies of the store actions with API calls (optimistic updates
   already feel instant), or wrap them with TanStack Query.
4. Add auth (Clerk/Auth.js); attach `userId` server-side. No component changes.
