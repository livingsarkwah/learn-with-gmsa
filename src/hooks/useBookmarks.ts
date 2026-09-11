import { useState, useCallback } from "react";

export function useBookmarks(initial: number[] = []) {
  const [bookmarks, setBookmarks] = useState<number[]>(initial);

  const toggleBookmark = useCallback((id: number) => {
    setBookmarks(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  }, []);

  const isBookmarked = useCallback((id: number) => bookmarks.includes(id), [bookmarks]);

  return { bookmarks, toggleBookmark, isBookmarked };
}
