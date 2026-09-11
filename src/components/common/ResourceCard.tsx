import { Download, Eye, Clock, Bookmark, BookmarkCheck, FileText, Play } from "lucide-react";
import type { Resource } from "../../types";
import { COLLECTION_ACCENT } from "../../constants/data";
import { badgeClass, fmtNum, shortProg, MONO, SANS } from "../../utils";

interface Props {
  resource: Resource;
  bookmarks: number[];
  onBookmark: (id: number) => void;
  onOpen: (id: number) => void;
  compact?: boolean;
}

function TypeIcon({ type, cls = "w-4 h-4" }: { type: string; cls?: string }) {
  if (type === "Video") return <Play className={cls} />;
  return <FileText className={cls} />;
}

export function ResourceCard({ resource: r, bookmarks, onBookmark, onOpen, compact = false }: Props) {
  const saved  = bookmarks.includes(r.id);
  const accent = COLLECTION_ACCENT[r.collection];

  return (
    <article
      className="group bg-card border border-border rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
      style={SANS}
    >
      {/* Collection-type accent strip */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: accent?.dot ?? "#16a34a" }} />

      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
              style={{ background: (accent?.dot ?? "#16a34a") + "1a" }}
            >
              <TypeIcon type={r.type} cls="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-muted-foreground tracking-wider truncate" style={MONO}>
              {r.courseCode}
            </span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onBookmark(r.id); }}
            aria-label={saved ? "Remove bookmark" : "Bookmark"}
            className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${saved ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
          >
            {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Title */}
        <button onClick={() => onOpen(r.id)} className="text-left">
          <h3 className="font-bold text-sm leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {r.title}
          </h3>
        </button>

        {/* Course title */}
        {!compact && <p className="text-xs text-muted-foreground truncate">{r.courseTitle}</p>}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${badgeClass(r.collection)}`}>{r.collection}</span>
          <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-muted text-muted-foreground">L{r.level}</span>
        </div>

        {/* Program */}
        {!compact && <p className="text-xs text-muted-foreground truncate">{shortProg(r.program)}</p>}

        {/* Footer stats */}
        <div className="mt-auto pt-3 border-t border-border flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Download className="w-3 h-3" />{fmtNum(r.downloads)}</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{fmtNum(r.views)}</span>
          <span className="ml-auto flex items-center gap-1 tabular-nums" style={MONO}>{r.uploadDate.slice(0, 7)}</span>
        </div>
      </div>
    </article>
  );
}
