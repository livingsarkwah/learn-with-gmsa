import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ResourceId } from "../types";
import { hasSupabaseConfig, supabase } from "./supabase";

interface AppContextValue {
  dark: boolean;
  toggleDark: () => void;
  bookmarks: ResourceId[];
  toggleBookmark: (id: ResourceId) => void;
  adminAuthed: boolean;
  adminAuthLoading: boolean;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const [bookmarks, setBookmarks] = useState<ResourceId[]>([]);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminAuthLoading, setAdminAuthLoading] = useState(true);

  const toggleDark = useCallback(() => setDark(d => !d), []);

  const toggleBookmark = useCallback((id: ResourceId) => {
    setBookmarks(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  }, []);

  const isAdmin = useCallback(async (user: { email?: string | null } | null) => {
    if (!user?.email) return false;

    const { data, error } = await supabase
      .from("admins")
      .select("id")
      .eq("email", user.email)
      .maybeSingle();

    return !error && Boolean(data);
  }, []);

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      setAdminAuthLoading(false);
      return;
    }

    let active = true;

    void supabase.auth.getSession().then(async ({ data: { session } }) => {
      const authorized = await isAdmin(session?.user ?? null);
      if (!active) return;
      setAdminAuthed(authorized);
      setAdminAuthLoading(false);
      if (session && !authorized) await supabase.auth.signOut();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setAdminAuthed(false);
        return;
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setTimeout(() => {
          void isAdmin(session?.user ?? null).then(authorized => {
            if (active) setAdminAuthed(authorized);
            if (session && !authorized) void supabase.auth.signOut();
          });
        }, 0);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [isAdmin]);

  const adminLogin = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (!hasSupabaseConfig()) return false;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return false;

    const authorized = await isAdmin(data.user);
    if (!authorized) {
      await supabase.auth.signOut();
      return false;
    }

    setAdminAuthed(true);
    return true;
  }, [isAdmin]);

  const adminLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setAdminAuthed(false);
  }, []);

  return (
    <AppContext.Provider value={{ dark, toggleDark, bookmarks, toggleBookmark, adminAuthed, adminAuthLoading, adminLogin, adminLogout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
