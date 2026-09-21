import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Award, FolderOpen, GraduationCap, BookOpen, Users, ArrowRight, LogIn, Search, PackageOpen } from "lucide-react";
import { ResourceCard } from "../../components/common/ResourceCard";
import { Footer } from "../../components/layout/Footer";
import { POPULAR_COURSES, QUICK_ACCESS } from "../../constants/data";
import { useApp } from "../../lib/AppContext";
import { useResources } from "../../hooks/useResourceQueries";
import { MONO, SANS } from "../../utils";

export function HomePage() {
  const { bookmarks, toggleBookmark } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const resourcesQuery = useResources();
  const resources = resourcesQuery.data ?? [];
  const featured = useMemo(() => resources.filter(r => r.featured).slice(0, 3), [resources]);
  const recent = useMemo(
    () => [...resources].sort((a, b) => b.uploadDate.localeCompare(a.uploadDate)).slice(0, 4),
    [resources],
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div style={SANS}>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[420px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="/images/hero.png"
            alt="Muslim students collaborating"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, rgba(5,46,22,0.96) 0%, rgba(21,128,61,0.88) 55%, rgba(22,163,74,0.70) 100%)" }} />
        </div>

        <div className="relative w-full max-w-5xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4 tracking-tight">
              KNUST Knowledge,<br /><span className="text-yellow-300">All in One Place.</span>
            </h1>
            <p className="text-white/75 text-base sm:text-lg mb-8 max-w-xl leading-relaxed">
              Lecture notes, past questions, textbooks and tutorials — curated for every programme across all six KNUST colleges.
            </p>
            <form onSubmit={handleSearch}>
              <div className="flex items-center gap-2 bg-white dark:bg-background rounded-2xl p-2 shadow-2xl shadow-black/30 max-w-xl">
                <Search className="w-5 h-5 text-muted-foreground ml-2 flex-shrink-0" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search by course, topic, code…"
                  className="flex-1 text-sm bg-transparent focus:outline-none text-foreground placeholder:text-muted-foreground py-1.5"
                />
                <button type="submit" className="flex-shrink-0 px-5 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors">
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-wrap gap-4 mt-8">
              {[
                { icon: <FolderOpen className="w-3.5 h-3.5" />, value: "10,000+", label: "Resources" },
                { icon: <GraduationCap className="w-3.5 h-3.5" />, value: "90+", label: "Programmes" },
                { icon: <BookOpen className="w-3.5 h-3.5" />, value: "4000+", label: "Courses" },
                { icon: <Users className="w-3.5 h-3.5" />, value: "12k+", label: "Students" },
              ].map(({ icon, value, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-white/80 text-xs">
                  <span className="text-yellow-300">{icon}</span>
                  <span className="font-bold text-white text-sm" style={MONO}>{value}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Semester Pack CTA ────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 pt-10 pb-0">
        <div
          className="flex items-center justify-between gap-4 rounded-2xl px-6 py-5"
          style={{ background: "linear-gradient(135deg, #14532d 0%, #166534 60%, #15803d 100%)" }}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
              <PackageOpen className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Get Your Semester Pack</p>
              <p className="text-white/65 text-xs mt-0.5 hidden sm:block">
                Pick your college, programme, level and semester — then download a full resource manifest in one click.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/semester-pack")}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-yellow-400 text-yellow-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors text-sm"
          >
            Get Pack <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ── Quick Access ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-xl font-bold text-foreground">Quick Access</h2>
          <button onClick={() => navigate("/library")} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
            All categories <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {QUICK_ACCESS.map(({ label, Icon, palette, desc }) => (
            <button key={label} onClick={() => navigate("/library")}
              className={`${palette} rounded-2xl p-4 text-left border border-transparent hover:border-current/20 transition-all duration-200`}>
              <Icon className="w-7 h-7 mb-3 opacity-90" />
              <p className="font-bold text-sm mb-0.5">{label}</p>
              <p className="text-xs opacity-70 leading-snug hidden sm:block">{desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── Featured Resources ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-xl font-bold text-foreground">Featured Resources</h2>
          <button onClick={() => navigate("/library")} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map(r => (
            <ResourceCard key={r.id} resource={r} bookmarks={bookmarks} onBookmark={toggleBookmark} onOpen={id => navigate(`/resources/${encodeURIComponent(String(id))}`)} />
          ))}
        </div>
      </section>

      {/* ── Popular Courses ──────────────────────────── */}
      <section style={{ background: "linear-gradient(180deg, var(--secondary) 0%, var(--background) 100%)" }} className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-xl font-bold text-foreground">Popular Courses</h2>
            <span className="text-xs text-muted-foreground">{POPULAR_COURSES.length} courses</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {POPULAR_COURSES.map(c => (
              <button key={c.code} onClick={() => navigate(`/library?course=${encodeURIComponent(c.code)}`)}
                className="bg-card border border-border rounded-2xl p-4 text-left group hover:border-primary/30 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg" style={MONO}>{c.code}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">L{c.level}</span>
                </div>
                <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors mb-1">{c.title}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{c.program}</span>
                  <span className="flex items-center gap-1"><FolderOpen className="w-3 h-3" />{c.n} resources</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recently Added ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-xl font-bold text-foreground">Recently Added</h2>
          <button onClick={() => navigate("/library")} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
            Browse library <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recent.map(r => (
            <ResourceCard key={r.id} resource={r} bookmarks={bookmarks} onBookmark={toggleBookmark} onOpen={id => navigate(`/resources/${encodeURIComponent(String(id))}`)} compact />
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{ background: "linear-gradient(135deg, #14532d 0%, #15803d 50%, #16a34a 100%)" }}>
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border-2 border-white/5 pointer-events-none" />
          <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full border-2 border-white/5 pointer-events-none" />
          <div className="text-white relative">
            <h3 className="text-2xl sm:text-3xl font-black mb-2">GMSA Members get full access</h3>
            <p className="text-white/70 text-sm max-w-md">Sign in with your Student ID to download resources, save bookmarks, and access member-only content.</p>
          </div>
          <button onClick={() => navigate("/login")}
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-yellow-400 text-yellow-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors shadow-xl text-sm">
            <LogIn className="w-4 h-4" />Get Access
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
