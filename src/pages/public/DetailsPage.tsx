import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ChevronLeft, ChevronRight, Download, Eye, Clock, FileText,
  Play, Tag, Bookmark, BookmarkCheck, Share2, CheckCircle, Mail, MessageCircle, Send,
} from "lucide-react";
import { ResourceCard } from "../../components/common/ResourceCard";
import { ALL_RESOURCES, COLLECTION_ACCENT } from "../../constants/data";
import { useApp } from "../../lib/AppContext";
import { badgeClass, fmtNum, shortProg, MONO, SANS } from "../../utils";

export function DetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { bookmarks, toggleBookmark } = useApp();

  const r = ALL_RESOURCES.find(x => x.id === Number(id)) ?? ALL_RESOURCES[0];
  const saved  = bookmarks.includes(r.id);
  const accent = COLLECTION_ACCENT[r.collection];
  const [downloaded, setDownloaded] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const related = ALL_RESOURCES.filter(x => x.id !== r.id && (x.program === r.program || x.collection === r.collection)).slice(0, 3);
  const shareUrl = typeof window !== "undefined" ? window.location.href : `/resources/${r.id}`;
  const shareText = `${r.title} (${r.courseCode})`;
  const shareMessage = `${shareText}\n${shareUrl}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6" style={SANS}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 flex-wrap">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-primary transition-colors font-medium">
          <ChevronLeft className="w-3.5 h-3.5" />Back
        </button>
        <ChevronRight className="w-3 h-3 opacity-40" />
        <button onClick={() => navigate("/library")} className="hover:text-primary transition-colors">Library</button>
        <ChevronRight className="w-3 h-3 opacity-40" />
        <span>{shortProg(r.program)}</span>
        <ChevronRight className="w-3 h-3 opacity-40" />
        <span className="text-foreground font-semibold" style={MONO}>{r.courseCode}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-7">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${badgeClass(r.collection)}`}>{r.collection}</span>
              <span className="text-xs px-2.5 py-1 rounded-lg font-bold bg-muted text-muted-foreground">Level {r.level}</span>
              <span className="text-xs px-2.5 py-1 rounded-lg font-bold bg-muted text-muted-foreground">{r.semester} Semester</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground leading-tight mb-2">{r.title}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
              <span className="font-bold text-primary" style={MONO}>{r.courseCode}</span>
              <span className="opacity-40">·</span>
              <span>{r.courseTitle}</span>
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-5 text-sm text-muted-foreground py-4 border-y border-border">
            <span className="flex items-center gap-1.5"><Download className="w-4 h-4 text-primary" />{fmtNum(r.downloads)} downloads</span>
            <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-primary" />{fmtNum(r.views)} views</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" />Added {r.uploadDate}</span>
          </div>

          {/* Viewer */}
          <div>
            <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />Preview
            </h2>
            <div className="rounded-2xl border border-border overflow-hidden bg-slate-50 dark:bg-muted/20">
              {r.type === "Video" ? (
                <div className="aspect-video flex flex-col items-center justify-center gap-4 bg-slate-900 text-white">
                  <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <Play className="w-9 h-9 text-primary fill-primary ml-1" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-base">Video Lecture Series</p>
                    <p className="text-sm opacity-50 mt-0.5">12 episodes · ~45 min each</p>
                  </div>
                  <button className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors">Play Episode 1</button>
                </div>
              ) : (
                <div className="p-5 sm:p-8">
                  <div className="max-w-xl mx-auto bg-white dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="h-9 flex items-center px-4 gap-2 text-white text-xs font-semibold" style={{ background: accent?.dot ?? "#16a34a" }}>
                      <FileText className="w-3.5 h-3.5" />
                      <span className="truncate">{r.courseCode} — {r.title}.pdf</span>
                      <span className="ml-auto opacity-75">Page 1 of 48</span>
                    </div>
                    <div className="p-6 sm:p-8 space-y-5">
                      <div className="text-center space-y-1 pb-5 border-b border-border">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Kwame Nkrumah University of Science and Technology</p>
                        <p className="text-xs text-muted-foreground">College of Engineering</p>
                        <h3 className="text-base font-black text-foreground mt-3">{r.courseCode}: {r.courseTitle}</h3>
                        <h4 className="text-sm font-bold" style={{ color: accent?.dot ?? "#16a34a" }}>{r.title}</h4>
                        <p className="text-xs text-muted-foreground">{r.semester} Semester, 2024/25</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground mb-2">Table of Contents</p>
                        <div className="space-y-1.5">
                          {["Introduction and Course Overview", "Fundamental Concepts", "Theoretical Framework", "Applied Analysis Methods", "Case Studies", "Practice Problems"].map((item, i) => (
                            <div key={i} className="flex justify-between text-xs text-muted-foreground border-b border-dashed border-border pb-1">
                              <span>{i + 1}. {item}</span>
                              <span style={MONO}>{i * 7 + 1}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        {[100, 85, 100, 75, 90, 65, 100].map((w, i) => (
                          <div key={i} className="h-2.5 bg-muted rounded-sm" style={{ width: `${w}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-sm font-bold text-foreground mb-2">About this resource</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{r.description}</p>
          </div>

          {/* Tags */}
          <div>
            <h2 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2"><Tag className="w-3.5 h-3.5 text-primary" />Tags</h2>
            <div className="flex flex-wrap gap-2">
              {r.tags.map(tag => (
                <button key={tag} onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
                  className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors">
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3 sticky top-20">
            <button
              onClick={() => setDownloaded(true)}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${downloaded ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25"}`}
            >
              {downloaded ? <><CheckCircle className="w-4 h-4" />Downloaded</> : <><Download className="w-4 h-4" />Download Resource</>}
            </button>
            <button onClick={() => toggleBookmark(r.id)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm border transition-colors ${saved ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>
              {saved ? <><BookmarkCheck className="w-4 h-4" />Bookmarked</> : <><Bookmark className="w-4 h-4" />Bookmark</>}
            </button>
            <button
              onClick={() => setShareOpen(open => !open)}
              aria-expanded={shareOpen}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm border border-border text-muted-foreground hover:bg-muted transition-colors"
            >
              <Share2 className="w-4 h-4" />Share
            </button>
            {shareOpen && (
              <div className="grid grid-cols-3 gap-2 pt-1" aria-label="Share resource via">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setShareOpen(false)}
                  className="flex flex-col items-center gap-1 rounded-xl border border-border px-2 py-2 text-xs font-semibold text-muted-foreground hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />WhatsApp
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(`Learn with GMSA: ${r.title}`)}&body=${encodeURIComponent(shareMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setShareOpen(false)}
                  className="flex flex-col items-center gap-1 rounded-xl border border-border px-2 py-2 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4" />Email
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setShareOpen(false)}
                  className="flex flex-col items-center gap-1 rounded-xl border border-border px-2 py-2 text-xs font-semibold text-muted-foreground hover:border-sky-500 hover:text-sky-600 transition-colors"
                >
                  <Send className="w-4 h-4" />Telegram
                </a>
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Resource Info</h3>
            <dl className="space-y-3">
              {[
                ["Program",    shortProg(r.program)],
                ["Course",     `${r.courseCode} — ${r.courseTitle}`],
                ["Collection", r.collection],
                ["Type",       r.type],
                ["Level",      `Level ${r.level}`],
                ["Semester",   `${r.semester} Semester`],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="text-sm font-semibold text-foreground mt-0.5">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-black text-foreground mb-5">Related Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map(r => (
              <ResourceCard key={r.id} resource={r} bookmarks={bookmarks} onBookmark={toggleBookmark} onOpen={id => navigate(`/resources/${id}`)} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
