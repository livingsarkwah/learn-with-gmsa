import { useState, useCallback } from "react";

// Simple in-memory auth state. In production this would use
// a token stored in sessionStorage / a real auth service.
let _authed = false;

export function useAdminAuth() {
  const [authed, setAuthed] = useState(_authed);

  const login = useCallback((password: string): boolean => {
    // Demo credentials
    if (password === "amse-admin-2024") {
      _authed = true;
      setAuthed(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    _authed = false;
    setAuthed(false);
  }, []);

  return { authed, login, logout };
}
