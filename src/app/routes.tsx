import { createBrowserRouter, Navigate } from "react-router";

// Layouts
import { PublicRoot } from "../layouts/PublicRoot";
import { AdminRoot }  from "../layouts/AdminRoot";

// Public pages
import { HomePage }          from "../pages/public/HomePage";
import { LibraryPage }       from "../pages/public/LibraryPage";
import { DetailsPage }       from "../pages/public/DetailsPage";
import { SearchPage }        from "../pages/public/SearchPage";
import { BookmarksPage }     from "../pages/public/BookmarksPage";
import { SemesterPackPage }  from "../pages/public/SemesterPackPage";

// Auth
import { LoginPage }      from "../features/auth/LoginPage";
import { AdminLoginPage } from "../features/auth/AdminLoginPage";

// Admin pages
import { DashboardPage } from "../pages/admin/DashboardPage";
import { ResourcesPage } from "../pages/admin/ResourcesPage";
import { UploadPage }    from "../pages/admin/UploadPage";
import { CoursesPage }   from "../pages/admin/CoursesPage";
import { ProgramsPage }  from "../pages/admin/ProgramsPage";
import { AnalyticsPage } from "../pages/admin/AnalyticsPage";
import { SettingsPage }  from "../pages/admin/SettingsPage";

// 404
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-7xl font-black text-primary mb-4">404</p>
      <h1 className="text-2xl font-bold text-foreground mb-2">Page not found</h1>
      <p className="text-muted-foreground text-sm mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors">
        Go to Home
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  // ── Public site ────────────────────────────────────────────────
  {
    path: "/",
    Component: PublicRoot,
    children: [
      { index: true,               Component: HomePage },
      { path: "library",           Component: LibraryPage },
      { path: "resources/:id",     Component: DetailsPage },
      { path: "search",            Component: SearchPage },
      { path: "bookmarks",         Component: BookmarksPage },
      { path: "semester-pack",     Component: SemesterPackPage },
      { path: "login",             Component: LoginPage },
      { path: "*",                 Component: NotFound },
    ],
  },

  // ── Admin — login (no auth required) ───────────────────────────
  {
    path: "/admin/login",
    Component: AdminLoginPage,
  },

  // ── Admin — protected ──────────────────────────────────────────
  {
    path: "/admin",
    Component: AdminRoot,
    children: [
      { index: true,   element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", Component: DashboardPage },
      { path: "resources", Component: ResourcesPage },
      { path: "upload",    Component: UploadPage },
      { path: "programs",  Component: ProgramsPage },
      { path: "courses",   Component: CoursesPage },
      { path: "analytics", Component: AnalyticsPage },
      { path: "settings",  Component: SettingsPage },
    ],
  },
]);
