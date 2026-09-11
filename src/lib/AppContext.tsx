import { createContext, useContext, useState, useCallback } from "react";

interface AppContextValue {
  dark: boolean;
  toggleDark: () => void;
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  adminAuthed: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([2, 5, 10]);
  const [adminAuthed, setAdminAuthed] = useState(false);

  const toggleDark = useCallback(() => setDark(d => !d), []);

  const toggleBookmark = useCallback((id: number) => {
    setBookmarks(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  }, []);

  const adminLogin = useCallback((password: string): boolean => {
    if (password === "gmsa-admin-2024") {
      setAdminAuthed(true);
      return true;
    }
    return false;
  }, []);

  const adminLogout = useCallback(() => setAdminAuthed(false), []);

  return (
    <AppContext.Provider value={{ dark, toggleDark, bookmarks, toggleBookmark, adminAuthed, adminLogin, adminLogout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
