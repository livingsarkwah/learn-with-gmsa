import { useState, useCallback } from "react";
import type { ResourceId } from "../types";

export function useBookmarks(initial: ResourceId[] = []) {
  const [bookmarks, setBookmarks] = useState<ResourceId[]>(initial);

  const toggleBookmark = useCallback((id: ResourceId) => {
    setBookmarks(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  }, []);

  const isBookmarked = useCallback((id: ResourceId) => bookmarks.includes(id), [bookmarks]);

  return { bookmarks, toggleBookmark, isBookmarked };
}
