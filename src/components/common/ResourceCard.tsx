import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Download, Bookmark, BookmarkCheck, FileText, Play, Share2, ExternalLink, Copy, Mail, Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import type { Resource, ResourceId } from "../../types";
import { COLLECTION_ACCENT } from "../../constants/data";
import { badgeClass, fmtNum, shortProg, MONO, SANS } from "../../utils";
import { incrementDownloadCount } from "../../utils/data/resources";
import { resourceQueryKeys } from "../../hooks/useResourceQueries";

interface Props {
  resource: Resource;
  bookmarks: ResourceId[];
  onBookmark: (id: ResourceId) => void;
  onOpen: (id: ResourceId) => void;
  compact?: boolean;
}

function TypeIcon({ type, cls = "w-4 h-4" }: { type: string; cls?: string }) {
  if (type === "Video") return <Play className={cls} />;
  return <FileText className={cls} />;
}

export function ResourceCard({ resource: r, bookmarks, onBookmark, onOpen, compact = false }: Props) {
  const saved  = bookmarks.some(id => id === r.id);
  const accent = COLLECTION_ACCENT[r.collection];
  const [shareOpen, setShareOpen] = useState(false);
  const queryClient = useQueryClient();

  function getShareDetails() {
    const url = `${window.location.origin}/resources/${encodeURIComponent(String(r.id))}`;
    const text = `${r.title} (${r.courseCode})`;
    return { url, text };
  }

  async function copyResourceLink() {
    const { url } = getShareDetails();

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Resource link copied");
      setShareOpen(false);
    } catch {
      toast.error("Unable to copy resource link");
    }
  }

  function shareTo(channel: "whatsapp" | "email" | "telegram") {
    const { url, text } = getShareDetails();
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(`${text}\n${url}`);
    const target = channel === "whatsapp"
      ? `https://wa.me/?text=${encodedText}`
      : channel === "telegram"
        ? `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(text)}`
        : `mailto:?subject=${encodeURIComponent(`Learn with GMSA | Shared resource: ${r.title}`)}&body=${encodedText}`;

    if (channel === "email") window.location.href = target;
    else window.open(target, "_blank", "noopener,noreferrer");
    setShareOpen(false);
  }

  function openResource() {
    if (r.fileUrl) window.open(r.fileUrl, "_blank", "noopener,noreferrer");
    else onOpen(r.id);
  }

  function downloadResource() {
    if (r.type !== "Video") {
      void incrementDownloadCount(r.id).then(() => {
        void queryClient.invalidateQueries({ queryKey: resourceQueryKeys.all });
      });
    }
  }

  return (
    <article
      className="group relative bg-card border border-border rounded-2xl overflow-visible flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
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
          <div className="relative flex-shrink-0">
          <button
            onClick={e => { e.stopPropagation(); setShareOpen(open => !open); }}
            aria-label="Share resource"
            aria-expanded={shareOpen}
            className="flex-shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {shareOpen && (
            <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-border bg-card p-1.5 shadow-xl" onClick={e => e.stopPropagation()}>
              <button onClick={() => void copyResourceLink()} className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-foreground hover:bg-muted">
                <Copy className="w-3.5 h-3.5" />Copy link
              </button>
              <button onClick={() => shareTo("whatsapp")} className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-foreground hover:bg-muted">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />WhatsApp
              </button>
              <button onClick={() => shareTo("email")} className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-foreground hover:bg-muted">
                <Mail className="w-3.5 h-3.5 text-sky-600" />Email
              </button>
              <button onClick={() => shareTo("telegram")} className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-foreground hover:bg-muted">
                <Send className="w-3.5 h-3.5 text-blue-500" />Telegram
              </button>
            </div>
          )}
          </div>
        </div>

        {/* Title */}
        <button onClick={() => onOpen(r.id)} className="text-left">
          <h3 className="font-bold text-sm leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {r.title}
          </h3>
        </button>

        <div className="flex items-center gap-2">
          {r.type === "PDF" && r.fileUrl && (
            <button onClick={openResource} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
              <FileText className="w-3.5 h-3.5" />Preview
            </button>
          )}
          {r.type === "Video" && r.fileUrl ? (
            <button onClick={openResource} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
              <ExternalLink className="w-3.5 h-3.5" />Watch
            </button>
          ) : r.fileUrl && (
            <a href={r.fileUrl} download={r.fileName} target="_blank" rel="noreferrer" onClick={e => { e.stopPropagation(); downloadResource(); }} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
              <Download className="w-3.5 h-3.5" />Download
            </a>
          )}
        </div>

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
          {r.type !== "Video" && <span className="flex items-center gap-1"><Download className="w-3 h-3" />{fmtNum(r.downloads)}</span>}
          <span className="ml-auto flex items-center gap-1 tabular-nums" style={MONO}>{r.uploadDate.slice(0, 7)}</span>
        </div>
      </div>
    </article>
  );
}
