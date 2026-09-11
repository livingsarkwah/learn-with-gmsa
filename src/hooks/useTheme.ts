import { useState, useCallback } from "react";

export function useTheme(defaultDark = false) {
  const [dark, setDark] = useState(defaultDark);
  const toggleDark = useCallback(() => setDark(d => !d), []);
  return { dark, setDark, toggleDark };
}
