import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Search, Filter, LayoutGrid, LayoutList, Bookmark, BookmarkCheck } from "lucide-react";
import { ResourceCard } from "../../components/common/ResourceCard";
import { FilterSidebar } from "../../components/common/FilterSidebar";
import { COLLEGE_PROGRAMS } from "../../constants/data";
import { useApp } from "../../lib/AppContext";
import { useResources } from "../../hooks/useResourceQueries";
import { academicLabelsMatch } from "../../utils/data/shared";
import type { Filters, Resource } from "../../types";
import { badgeClass, MONO, SANS } from "../../utils";

const EMPTY: Filters = { college: "", program: "", level: "", semester: "", collection: "", type: "", courseSearch: "" };

export function SearchPage() {
  const { bookmarks, toggleBookmark } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [inputQuery, setInputQuery] = useState(urlQuery);
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [grid, setGrid] = useState(true);
  const resourcesQuery = useResources();
  const resources = resourcesQuery.data ?? [];

  useEffect(() => { setInputQuery(urlQuery); }, [urlQuery]);

  const results = useMemo(() => {
    if (!urlQuery) return [];
    const q = urlQuery.toLowerCase();
    return resources.filter(r => {
      if (!r.title.toLowerCase().includes(q) && !r.courseCode.toLowerCase().includes(q) && !r.courseTitle.toLowerCase().includes(q) && !r.tags.some(t => t.toLowerCase().includes(q)) && !r.program.toLowerCase().includes(q)) return false;
      if (filters.college) {
        const cp = COLLEGE_PROGRAMS[filters.college] ?? [];
        const matchesCollege = r.college && academicLabelsMatch(r.college, filters.college);
        const matchesCollegeProgram = cp.some(program => academicLabelsMatch(program, r.program));
        if (!matchesCollege && !matchesCollegeProgram) return false;
      }
      if (filters.program && !academicLabelsMatch(r.program, filters.program)) return false;
      if (filters.level && r.level !== filters.level) return false;
      if (filters.semester && r.semester !== filters.semester) return false;
      if (filters.collection && r.collection !== filters.collection) return false;
      if (filters.type && r.type !== filters.type) return false;
      return true;
    });
  }, [filters, resources, urlQuery]);

  const loading = resourcesQuery.isPending;
  const fetching = resourcesQuery.isFetching;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (inputQuery.trim()) setSearchParams({ q: inputQuery.trim() }, { replace: true });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-6" style={SANS}>
      {/* Search bar */}
      <div className="mb-6">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 bg-card border border-border rounded-2xl p-2 shadow-sm max-w-2xl">
            <Search className="w-5 h-5 text-muted-foreground ml-2 flex-shrink-0" />
            <input
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder="Search resources, courses, topics…"
              className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
            />
            <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors flex-shrink-0">
              Search
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
          <p className="text-sm text-muted-foreground">
            {urlQuery
              ? <><span className="font-bold text-foreground text-base">{results.length}</span> result{results.length !== 1 ? "s" : ""} for <span className="text-primary font-bold">"{urlQuery}"</span></>
              : <span>Enter a search term to find resources</span>
            }
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-muted">
              <Filter className="w-3.5 h-3.5 text-primary" />Filters
            </button>
            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button onClick={() => setGrid(true)} className={`p-1.5 ${grid ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}><LayoutGrid className="w-3.5 h-3.5" /></button>
              <button onClick={() => setGrid(false)} className={`p-1.5 ${!grid ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}><LayoutList className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="sticky top-20 bg-card border border-border rounded-2xl p-4">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>
        </aside>

        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="relative ml-auto w-[min(80vw,320px)] h-full bg-background border-l border-border p-4 overflow-y-auto">
              <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {loading && resources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="w-14 h-14 text-muted-foreground/20 mb-4" />
              <p className="font-bold text-foreground mb-1">Searching resources…</p>
            </div>
          ) : resourcesQuery.error && resources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="w-14 h-14 text-muted-foreground/20 mb-4" />
              <p className="font-bold text-foreground mb-1">Unable to load resources</p>
              <p className="text-sm text-muted-foreground">Please try again shortly.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="w-14 h-14 text-muted-foreground/20 mb-4" />
              <p className="font-bold text-foreground mb-1">No results found</p>
              <p className="text-sm text-muted-foreground">Try different keywords or clear the filters.</p>
            </div>
          ) : grid ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {results.map(r => <ResourceCard key={r.id} resource={r} bookmarks={bookmarks} onBookmark={toggleBookmark} onOpen={id => navigate(`/resources/${encodeURIComponent(String(id))}`)} />)}
            </div>
          ) : (
            <div className="space-y-2">
              {results.map(r => {
                const saved = bookmarks.includes(r.id);
                return (
                  <div key={r.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3 hover:shadow-md transition-all">
                    <div className="flex-1 min-w-0">
                      <button onClick={() => navigate(`/resources/${encodeURIComponent(String(r.id))}`)} className="font-bold text-sm text-foreground hover:text-primary transition-colors text-left block truncate max-w-full">{r.title}</button>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs font-bold text-muted-foreground" style={MONO}>{r.courseCode}</span>
                        <span className="text-muted-foreground/50 text-xs">·</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${badgeClass(r.collection)}`}>{r.collection}</span>
                      </div>
                    </div>
                    <button onClick={() => toggleBookmark(r.id)} className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${saved ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"}`}>
                      {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          {fetching && resources.length > 0 && <p className="mt-4 text-center text-xs text-muted-foreground">Updating resources…</p>}
        </div>
      </div>
    </div>
  );
}
