import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StudyPlanner from './pages/StudyPlanner';
import PomodoroTimer from './pages/PomodoroTimer';
import NotesSection from './pages/NotesSection';
import FlashcardsMode from './pages/FlashcardsMode';
import AIAssistant from './pages/AIAssistant';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const plannerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/planner',
  component: StudyPlanner,
});

const timerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/timer',
  component: PomodoroTimer,
});

const notesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notes',
  component: NotesSection,
});

const flashcardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/flashcards',
  component: FlashcardsMode,
});

const aiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ai-assistant',
  component: AIAssistant,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  plannerRoute,
  timerRoute,
  notesRoute,
  flashcardsRoute,
  aiRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
