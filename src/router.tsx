import React, { useEffect } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  useLocation,
} from '@tanstack/react-router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './routes/index';
import { PostDetailPage } from './routes/post.$slug';
import { AdminPage } from './routes/admin';
import { AdminEditorPage } from './routes/adminEditor';

// Scroll to top instantly on route changes (no animation)
const ScrollToTop: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return null;
};

// Root Layout Component
const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0d1117] text-slate-800 dark:text-[#c9d1d9] antialiased selection:bg-accent/25 selection:text-white transition-colors duration-150">
      <ScrollToTop />
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

// 1. Create the root route
const rootRoute = createRootRoute({
  component: RootLayout,
});

// 2. Create the child routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const postRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/post/$slug',
  component: PostDetailPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const adminEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/editor',
  component: AdminEditorPage,
});

// 3. Create route tree
const routeTree = rootRoute.addChildren([indexRoute, postRoute, adminRoute, adminEditorRoute]);

// 4. Create and export the router
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
