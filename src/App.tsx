import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { useApplyChrome } from '@/hooks/useTheme';
import { ToastProvider } from '@/components/ui/Toast';
import { AppShell } from '@/components/layout/AppShell';
import { Onboarding } from '@/features/onboarding/Onboarding';

const TodayPage = lazy(() => import('@/features/today/TodayPage'));
const AffirmationsPage = lazy(() => import('@/features/affirmations/AffirmationsPage'));
const MethodsPage = lazy(() => import('@/features/methods/MethodsPage'));
const VisualizePage = lazy(() => import('@/features/visualize/VisualizePage'));
const JournalPage = lazy(() => import('@/features/journal/JournalPage'));
const GratitudePage = lazy(() => import('@/features/gratitude/GratitudePage'));
const MoodPage = lazy(() => import('@/features/mood/MoodPage'));
const FuturePage = lazy(() => import('@/features/future/FuturePage'));
const GoalsPage = lazy(() => import('@/features/goals/GoalsPage'));
const VisionPage = lazy(() => import('@/features/vision/VisionPage'));
const CoachPage = lazy(() => import('@/features/coach/CoachPage'));
const InsightsPage = lazy(() => import('@/features/insights/InsightsPage'));
const AchievementsPage = lazy(() => import('@/features/achievements/AchievementsPage'));
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'));

function Loader() {
  return (
    <div className="grid min-h-dvh place-items-center">
      <div className="size-10 animate-breathe rounded-2xl btn-grad" />
    </div>
  );
}

export default function App() {
  useApplyChrome();
  const hydrated = useStore((s) => s.hydrated);
  const name = useStore((s) => s.data.user.name);

  if (!hydrated) return <Loader />;

  return (
    <ToastProvider>
      {!name ? (
        <Onboarding />
      ) : (
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route element={<AppShell />}>
                <Route index element={<TodayPage />} />
                <Route path="affirmations" element={<AffirmationsPage />} />
                <Route path="methods" element={<MethodsPage />} />
                <Route path="visualize" element={<VisualizePage />} />
                <Route path="journal" element={<JournalPage />} />
                <Route path="gratitude" element={<GratitudePage />} />
                <Route path="mood" element={<MoodPage />} />
                <Route path="future" element={<FuturePage />} />
                <Route path="goals" element={<GoalsPage />} />
                <Route path="vision" element={<VisionPage />} />
                <Route path="coach" element={<CoachPage />} />
                <Route path="insights" element={<InsightsPage />} />
                <Route path="achievements" element={<AchievementsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<TodayPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      )}
    </ToastProvider>
  );
}
