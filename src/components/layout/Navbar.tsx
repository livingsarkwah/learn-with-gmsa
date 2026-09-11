import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Bookmark, Moon, Sun, User, Menu, X, Home, Library, BookOpen, LogIn, Package } from "lucide-react";
import { SANS } from "../../utils";

interface Props {
  pathname: string;
  dark: boolean;
  toggleDark: () => void;
  bookmarks: number[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearch: (q: string) => void;
}

const NAV = [
  { label: "Home",          path: "/",               icon: <Home    className="w-4 h-4" /> },
  { label: "Library",       path: "/library",        icon: <Library className="w-4 h-4" /> },
  { label: "Semester Pack", path: "/semester-pack",  icon: <Package className="w-4 h-4" /> },
];

function isActive(pathname: string, path: string) {
  if (path === "/") return pathname === "/";
  return pathname.startsWith(path);
}

export function Navbar({ pathname, dark, toggleDark, bookmarks, searchQuery, setSearchQuery, onSearch }: Props) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setMobileOpen(false);
    }
  }

  return (
    <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border" style={SANS}>
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2 flex-shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/30 group-hover:bg-primary/90 transition-colors">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="hidden sm:block font-bold text-sm tracking-tight">
            <span className="text-primary">Learn</span>
            <span className="text-foreground"> with GMSA</span>
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5 ml-1">
          {NAV.map(l => (
            <button
              key={l.path}
              onClick={() => navigate(l.path)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(pathname, l.path)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {l.icon}{l.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Course, topic, code…"
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground"
            />
          </div>
        </form>

        {/* Right controls */}
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => navigate("/bookmarks")}
            aria-label="Bookmarks"
            className={`relative p-2 rounded-lg transition-colors ${
              isActive(pathname, "/bookmarks") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            {bookmarks.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                {bookmarks.length > 9 ? "9+" : bookmarks.length}
              </span>
            )}
          </button>

          <button onClick={toggleDark} aria-label="Toggle theme" className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => navigate("/login")}
            className="hidden sm:flex items-center gap-1.5 ml-1 px-3 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            <User className="w-3.5 h-3.5" />Sign In
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-2">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search resources…"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </form>
          {NAV.map(l => (
            <button
              key={l.path}
              onClick={() => { navigate(l.path); setMobileOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium ${
                isActive(pathname, l.path) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {l.icon}{l.label}
            </button>
          ))}
          <button
            onClick={() => { navigate("/login"); setMobileOpen(false); }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold"
          >
            <LogIn className="w-4 h-4" />Sign In / Register
          </button>
        </div>
      )}
    </nav>
  );
}
