import { Outlet, useNavigate, useLocation, Navigate } from "react-router";
import { AdminLayout } from "./AdminLayout";
import { useApp } from "../lib/AppContext";
import type { AdminPage } from "../types";

// Map URL segment → AdminPage key
const PATH_TO_PAGE: Record<string, AdminPage> = {
  dashboard: "dashboard",
  resources:  "resources",
  upload:     "upload",
  programs:   "programs",
  courses:    "courses",
  analytics:  "analytics",
  settings:   "settings",
};

export function AdminRoot() {
  const { dark, toggleDark, adminAuthed, adminAuthLoading, adminLogout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  if (adminAuthLoading) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  // If not authed, redirect to admin login
  if (!adminAuthed) {
    return <Navigate to="/admin/login" replace />;
  }

  // Derive current AdminPage from URL
  const segment = location.pathname.split("/").filter(Boolean)[1] ?? "dashboard";
  const currentPage: AdminPage = PATH_TO_PAGE[segment] ?? "dashboard";

  function handleSetPage(page: AdminPage) {
    navigate(`/admin/${page}`);
  }

  function handleLogout() {
    adminLogout();
    navigate("/admin/login");
  }

  return (
    <div className={dark ? "dark" : ""}>
      <AdminLayout
        adminPage={currentPage}
        setAdminPage={handleSetPage}
        dark={dark}
        toggleDark={toggleDark}
        onLogout={handleLogout}
      >
        <Outlet />
      </AdminLayout>
    </div>
  );
}
