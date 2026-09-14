import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Bookmark, Library, Trash2 } from "lucide-react";
import { ResourceCard } from "../../components/common/ResourceCard";
import { useApp } from "../../lib/AppContext";
import { getResources } from "../../utils/data/resources";
import type { Resource } from "../../types";
import { SANS } from "../../utils";

export function BookmarksPage() {
  const { bookmarks, toggleBookmark } = useApp();
  const navigate = useNavigate();
  const [saved, setSaved] = useState<Resource[]>([]);

  useEffect(() => {
    let active = true;

    getResources()
      .then(resources => {
        if (!active) return;
        setSaved(resources.filter(r => bookmarks.includes(r.id)));
      })
      .catch(() => {
        if (!active) return;
        setSaved([]);
      });

    return () => { active = false; };
  }, [bookmarks]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8" style={SANS}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-foreground">Bookmarks</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{saved.length} saved resource{saved.length !== 1 ? "s" : ""}</p>
        </div>
        {saved.length > 0 && (
          <button
            onClick={() => saved.forEach(r => toggleBookmark(r.id))}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />Clear all
          </button>
        )}
      </div>

      {saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center">
              <Bookmark className="w-12 h-12 text-muted-foreground/30" />
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-sm font-black">0</span>
            </div>
          </div>
          <h2 className="text-xl font-black text-foreground mb-2">Nothing saved yet</h2>
          <p className="text-sm text-muted-foreground max-w-xs mb-7">
            Tap the bookmark icon on any resource card to save it for quick access later.
          </p>
          <button
            onClick={() => navigate("/library")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            <Library className="w-4 h-4" />Browse Library
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map(r => (
            <ResourceCard key={r.id} resource={r} bookmarks={bookmarks} onBookmark={toggleBookmark} onOpen={id => navigate(`/resources/${encodeURIComponent(String(id))}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
