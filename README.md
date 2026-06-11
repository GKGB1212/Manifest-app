# 🌙 Manifest

A premium, calming, **bilingual (English 🇬🇧 / Tiếng Việt 🇻🇳)** manifestation
ecosystem — not a simple affirmation app. It combines proven manifestation
techniques with positive-psychology and habit-formation design to help you
clarify desires, strengthen belief, stay consistent, and notice real evidence
of progress.

Local-first: **all your data stays on your device.** Runs the moment you start
the dev server — no database, keys, or account required.

## ✨ Features

- **Affirmations** — curated library + custom, 10 life categories, favorites,
  tap-to-count repetition tracking, text-to-speech, and **mirror mode** (uses
  your front camera so you can speak to yourself).
- **369 Method** — guided 3× morning / 6× afternoon / 9× night workflow with a
  progress tracker, streaks, and history.
- **55×5 Method** — write your affirmation 55× a day for 5 days, with an auto
  counter and day-by-day completion.
- **Scripting & Journal** — write as if it’s already real; templates, AI
  prompts, emotion tagging, mood, goal linking, search & filter.
- **Gratitude** — three rotating prompts, gratitude streaks, mood tracking.
- **Visualization** — 5/10/15/30-min guided sessions with breathing animation
  and narration.
- **Vision Board** — upload images, drag to arrange, organize by category.
- **Future Self** — letters and conversations across 6-month / 1-year / 5-year
  horizons.
- **Goals + Evidence + Timeline** — measurable manifestation: importance &
  emotional intensity, milestones, an evidence log (signs, synchronicities,
  wins, opportunities), and a beautiful visual timeline.
- **Mood & Energy** — 6-dimension daily check-in with trend charts.
- **AI Coach** — supportive, reframes limiting beliefs, suggests affirmations &
  scripting prompts. Frames manifestation as intention, focus, self-awareness,
  habit, and opportunity recognition — never supernatural claims.
- **Gamification** — XP, levels, streaks, and badges (7-day, 30-day, 100
  gratitude, 50 visualizations, Manifestation Master…).
- **Insights** — consistency %, 30-day heatmap, practice-mix donut, mood trends.
- **Export** — JSON, CSV, and a print-ready PDF report; plus import & reset.

## 🎨 Experience

Glassmorphism, soft shadows, rounded corners, gradient hero, micro-interactions,
and premium typography (Sora + Inter). Full **dark mode**, **large-text**,
**reduce-motion**, focus-visible rings, and ARIA roles for accessibility.

## 🚀 Getting started

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # typecheck + production build
pnpm preview      # preview the build
```

## 🧱 Tech

React 19 · TypeScript · Vite · Tailwind v4 · Framer Motion · Zustand (+immer,
persist) · Recharts · React Router · lucide-react.

State persists to `localStorage` behind a single store boundary
(`src/lib/store.ts`). A production **Postgres schema** lives in
[`prisma/schema.prisma`](prisma/schema.prisma) and a full **architecture
overview** in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — the app is
designed so a REST/tRPC + Prisma + auth backend drops in without UI changes.

## 🌐 Language

Tap **EN / VI** in the top bar or sidebar (or change it in Settings). The
language is detected from your browser on first run.
