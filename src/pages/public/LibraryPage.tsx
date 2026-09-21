import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { Filter, LayoutGrid, FolderOpen, LayoutList, Bookmark, BookmarkCheck, Download, Eye } from "lucide-react";
import { ResourceCard } from "../../components/common/ResourceCard";
import { FilterSidebar } from "../../components/common/FilterSidebar";
import { COLLEGE_PROGRAMS } from "../../constants/data";
import { academicLabelsMatch } from "../../utils/data/shared";
import { useApp } from "../../lib/AppContext";
import { useResource, useResources } from "../../hooks/useResourceQueries";
import type { Filters } from "../../types";
import { badgeClass, fmtNum, shortProg, MONO, SANS } from "../../utils";

const EMPTY: Filters = { college: "", program: "", level: "", semester: "", collection: "", type: "", courseSearch: "" };

export function LibraryPage() {
  const { bookmarks, toggleBookmark } = useApp();
  const navigate = useNavigate();
  const { resourceId: pathResourceId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const resourceId = pathResourceId ?? searchParams.get("resourceId");
  const resourcesQuery = useResources();
  const resourceQuery = useResource(resourceId ?? undefined);
  const resources = resourceId
    ? resourceQuery.data ? [resourceQuery.data] : []
    : resourcesQuery.data ?? [];
  const loading = resourceId ? resourceQuery.isPending : resourcesQuery.isPending;
  const fetching = resourceId ? resourceQuery.isFetching : resourcesQuery.isFetching;
  const error = resourceId ? resourceQuery.error : resourcesQuery.error;
  const sharedResourceRef = useRef<HTMLDivElement | null>(null);

  // Sync filters with URL search params
  const [filters, setFilters] = useState<Filters>({
    ...EMPTY,
    college:      searchParams.get("college") ?? "",
    courseSearch: searchParams.get("course") ?? searchParams.get("q") ?? "",
    program:      searchParams.get("program") ?? "",
    level:        searchParams.get("level") ?? "",
    semester:     searchParams.get("semester") ?? "",
    collection:   searchParams.get("collection") ?? "",
    type:         searchParams.get("type") ?? "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [grid, setGrid] = useState(true);

  useEffect(() => {
    if (!loading && resourceId && sharedResourceRef.current) {
      sharedResourceRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [loading, resourceId]);

  // Update URL whenever filters change
  function handleSetFilters(f: Filters) {
    setFilters(f);
    const params: Record<string, string> = {};
    if (f.college)      params.college    = f.college;
    if (f.courseSearch) params.course     = f.courseSearch;
    if (f.program)      params.program    = f.program;
    if (f.level)        params.level      = f.level;
    if (f.semester)     params.semester   = f.semester;
    if (f.collection)   params.collection = f.collection;
    if (f.type)         params.type       = f.type;
    setSearchParams(params, { replace: true });
  }

  const results = resources.filter(r => {
    const cs = filters.courseSearch.toLowerCase();
    if (cs && !r.courseCode.toLowerCase().includes(cs) && !r.courseTitle.toLowerCase().includes(cs) && !r.title.toLowerCase().includes(cs)) return false;
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

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6" style={SANS}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-foreground">Resource Library</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {results.length} resource{results.length !== 1 ? "s" : ""}
            {activeCount > 0 ? ` · ${activeCount} filter${activeCount > 1 ? "s" : ""} active` : " available"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-sm font-semibold hover:bg-muted">
            <Filter className="w-4 h-4 text-primary" />Filters
            {activeCount > 0 && <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">{activeCount}</span>}
          </button>
          <div className="flex items-center border border-border rounded-xl overflow-hidden">
            <button onClick={() => setGrid(true)} className={`p-2 ${grid ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setGrid(false)} className={`p-2 ${!grid ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}><LayoutList className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="sticky top-20 bg-card border border-border rounded-2xl p-4">
            <FilterSidebar filters={filters} setFilters={handleSetFilters} />
          </div>
        </aside>

        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="relative ml-auto w-[min(80vw,320px)] h-full bg-background border-l border-border p-4 overflow-y-auto">
              <FilterSidebar filters={filters} setFilters={handleSetFilters} onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {loading && resources.length === 0 ? (
            <div className="py-24 text-center text-sm text-muted-foreground">Loading resources…</div>
          ) : error && resources.length === 0 ? (
            <div className="py-24 text-center text-sm text-destructive">Unable to load resources right now.</div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <FolderOpen className="w-14 h-14 text-muted-foreground/30 mb-4" />
              <p className="font-bold text-foreground mb-1">No matching resources</p>
              <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or search terms.</p>
              <button onClick={() => handleSetFilters(EMPTY)} className="text-sm text-primary font-semibold hover:underline">Clear all filters</button>
            </div>
          ) : grid ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {results.map(r => (
                <div key={r.id} ref={r.id === resourceId ? sharedResourceRef : undefined} className={r.id === resourceId ? "ring-2 ring-primary rounded-2xl" : undefined}>
                  <ResourceCard key={r.id} resource={r} bookmarks={bookmarks} onBookmark={toggleBookmark} onOpen={id => navigate(`/resources/${encodeURIComponent(String(id))}`)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {results.map(r => {
                const saved = bookmarks.includes(r.id);
                return (
                  <div key={r.id} ref={r.id === resourceId ? sharedResourceRef : undefined} className={`bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-all ${r.id === resourceId ? "ring-2 ring-primary" : ""}`}>
                    <div className="flex-1 min-w-0">
                      <button onClick={() => navigate(`/resources/${encodeURIComponent(String(r.id))}`)} className="font-bold text-sm text-foreground hover:text-primary transition-colors text-left truncate block max-w-full">{r.title}</button>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs font-bold text-muted-foreground" style={MONO}>{r.courseCode}</span>
                        <span className="text-muted-foreground text-xs">·</span>
                        <span className="text-xs text-muted-foreground truncate">{shortProg(r.program)}</span>
                        <span className={`hidden sm:inline text-xs px-2 py-0.5 rounded-md font-semibold ${badgeClass(r.collection)}`}>{r.collection}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {r.type !== "Video" && <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1" style={MONO}><Download className="w-3 h-3" />{fmtNum(r.downloads)}</span>}
                      <button onClick={() => toggleBookmark(r.id)} className={`p-1.5 rounded-lg transition-colors ${saved ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}>
                        {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {fetching && resources.length > 0 && (
            <p className="mt-4 text-center text-xs text-muted-foreground">Updating resources…</p>
          )}
        </div>
      </div>
    </div>
  );
}
