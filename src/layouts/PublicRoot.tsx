import { Outlet, useNavigate, useLocation } from "react-router";
import { useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { MobileBottomNav } from "../components/layout/MobileBottomNav";
import { useApp } from "../lib/AppContext";

export function PublicRoot() {
  const { dark, toggleDark, bookmarks } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [liveQuery, setLiveQuery] = useState("");

  // Derive current PublicPage for nav active state from URL
  const path = location.pathname;

  function handleSearch(q: string) {
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar
          pathname={path}
          dark={dark}
          toggleDark={toggleDark}
          bookmarks={bookmarks}
          searchQuery={liveQuery}
          setSearchQuery={setLiveQuery}
          onSearch={handleSearch}
        />
        <main className="pb-16 md:pb-0">
          <Outlet />
        </main>
        <MobileBottomNav pathname={path} bookmarks={bookmarks} />
      </div>
    </div>
  );
}
