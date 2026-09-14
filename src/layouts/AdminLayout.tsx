import { useState } from "react";
import {
  LayoutDashboard, FolderOpen, Upload, GraduationCap, BookOpen,
  Users, BarChart2, Settings, LogOut, Menu, X, BookMarked,
  Bell, Moon, Sun, ChevronRight, Shield,
} from "lucide-react";
import type { AdminPage } from "../types";
import { SANS } from "../utils";

interface Props {
  adminPage: AdminPage;
  setAdminPage: (p: AdminPage) => void;
  dark: boolean;
  toggleDark: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS: { page: AdminPage; label: string; Icon: React.ElementType }[] = [
  { page: "dashboard", label: "Dashboard",       Icon: LayoutDashboard },
  { page: "resources", label: "Resources",        Icon: FolderOpen },
  { page: "upload",    label: "Upload Resource",  Icon: Upload },
  { page: "programs",  label: "Programs",          Icon: GraduationCap },
  { page: "courses",   label: "Courses",           Icon: BookOpen },
  { page: "analytics", label: "Analytics",         Icon: BarChart2 },
  { page: "settings",  label: "Settings",          Icon: Settings },
];

const PAGE_TITLES: Record<AdminPage, string> = {
  dashboard: "Dashboard",
  resources: "Resources",
  upload:    "Upload Resource",
  programs:  "Programs",
  courses:   "Courses",
  analytics: "Analytics",
  settings:  "Settings",
};

export function AdminLayout({ adminPage, setAdminPage, dark, toggleDark, onLogout, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function NavLink({ page, label, Icon }: { page: AdminPage; label: string; Icon: React.ElementType }) {
    const active = adminPage === page;
    return (
      <button
        onClick={() => { setAdminPage(page); setSidebarOpen(false); }}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
          active
            ? "bg-primary text-white shadow-md shadow-primary/30"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
        }`}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span>{label}</span>
        {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
      </button>
    );
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full" style={SANS}>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30 flex-shrink-0">
            <BookMarked className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-sm text-slate-900 dark:text-white leading-tight">Learn with GMSA</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 mb-2">Main Menu</p>
        {NAV_ITEMS.slice(0, 2).map(item => <NavLink key={item.page} {...item} />)}
        <div className="my-3 border-t border-slate-200 dark:border-slate-700" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 mb-2">Content</p>
        {NAV_ITEMS.slice(2, 6).map(item => <NavLink key={item.page} {...item} />)}
        <div className="my-3 border-t border-slate-200 dark:border-slate-700" />
        <NavLink {...NAV_ITEMS[6]} />
      </nav>

      {/* Profile + logout */}
      <div className="px-3 pb-4 border-t border-slate-200 dark:border-slate-700 pt-3 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">GMSA Admin</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">admin@gmsa.knust.edu.gh</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900" style={SANS}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-slate-100">
              <X className="w-4 h-4" />
            </button>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div>
            <h1 className="font-black text-base text-slate-900 dark:text-white leading-none">{PAGE_TITLES[adminPage]}</h1>
            <p className="text-[11px] text-slate-400 mt-0.5">Learn with AMSE Admin</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">A</div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
