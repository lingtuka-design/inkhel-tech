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

// Scroll to top instantly and suppress all ads on admin routes
const RouteHandler: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const isAdmin = location.pathname.startsWith('/admin');

    if (isAdmin) {
      document.body.classList.add('admin-page');

      // Purge any ad elements immediately
      const purgeAds = () => {
        try {
          const selectors = [
            'ins.adsbygoogle',
            '.google-auto-placed',
            '[id*="google_ads"]',
            'iframe[id*="google_ads"]',
            'iframe[name*="aswift"]',
            '.adsbygoogle-noablate',
            '[data-ad-component]',
          ];
          document.querySelectorAll(selectors.join(', ')).forEach((el) => el.remove());
        } catch {}
      };

      purgeAds();

      // Observe and strip any auto-injected ads while in admin
      const observer = new MutationObserver(() => {
        purgeAds();
      });

      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
        document.body.classList.remove('admin-page');
      };
    } else {
      document.body.classList.remove('admin-page');
    }
  }, [location.pathname]);

  return null;
};

// Root Layout Component
const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0d1117] text-slate-800 dark:text-[#c9d1d9] antialiased selection:bg-accent/25 selection:text-white transition-colors duration-150">
      <RouteHandler />
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
