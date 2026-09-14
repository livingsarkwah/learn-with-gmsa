import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Search, ChevronDown, Upload, Trash2, Edit, Eye, RefreshCw,
  ChevronLeft, ChevronRight, MoreVertical, CheckSquare, Square,
  ArrowUpDown,
} from "lucide-react";
import { PROGRAMS, LEVELS, SEMESTERS, COLLECTIONS, RESOURCE_TYPES } from "../../constants/data";
import { badgeClass, statusBadge, fmtNum, MONO, SANS, shortProg } from "../../utils";
import type { Resource } from "../../types";
import { getResources } from "../../utils/getData";

const PAGE_SIZE = 8;

function FilterSelect({ label, options, value, onChange }: {
  label: string; options: readonly string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none text-xs border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 pr-7 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
        style={SANS}
      >
        <option value="">{label}</option>
        {options.map(o => <option key={o} value={o}>{o.length > 30 ? o.slice(0, 30) + "…" : o}</option>)}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
    </div>
  );
}

type ActionMenu = { id: string; open: boolean };

export function ResourcesPage() {
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [program, setProgram] = useState("");
  const [level, setLevel]     = useState("");
  const [semester, setSemester] = useState("");
  const [collection, setCollection] = useState("");
  const [type, setType]       = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage]       = useState(1);
  const [sortField, setSortField] = useState<keyof Resource>("uploadDate");
  const [sortAsc, setSortAsc] = useState(false);
  const [actionMenu, setActionMenu] = useState<ActionMenu | null>(null);

  useEffect(() => {
    let active = true;

    getResources()
      .then(data => {
        if (!active) return;
        setResources(data);
      })
      .catch(() => {
        if (!active) return;
        setResources([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const filtered = resources.filter(r => {
    const q = search.toLowerCase();
    if (search && !r.title.toLowerCase().includes(q) && !r.courseCode.toLowerCase().includes(q)) return false;
    if (program && r.program !== program) return false;
    if (level && r.level !== level) return false;
    if (semester && r.semester !== semester) return false;
    if (collection && r.collection !== collection) return false;
    if (type && r.type !== type) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const av = String(a[sortField]); const bv = String(b[sortField]);
    return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageRows   = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allSelected = pageRows.length > 0 && pageRows.every(r => selected.includes(String(r.id)));

  function toggleSort(field: keyof Resource) {
    if (sortField === field) setSortAsc(a => !a);
    else { setSortField(field); setSortAsc(true); }
  }

  function toggleAll() {
    if (allSelected) setSelected(s => s.filter(id => !pageRows.find(r => String(r.id) === id)));
    else setSelected(s => [...new Set([...s, ...pageRows.map(r => String(r.id))])]);
  }

  function clearFilters() {
    setSearch(""); setProgram(""); setLevel(""); setSemester(""); setCollection(""); setType("");
    setPage(1);
  }

  const SortIcon = ({ field }: { field: keyof Resource }) => (
    <button onClick={() => toggleSort(field)} className="ml-1 opacity-40 hover:opacity-100">
      <ArrowUpDown className="w-3 h-3 inline" />
    </button>
  );

  return (
    <div className="space-y-4" style={SANS}>
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by title or course code…"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Filters */}
          <FilterSelect label="Program" options={PROGRAMS.map(p => p.replace("BSc ", ""))} value={program} onChange={v => { setProgram(v ? PROGRAMS.find(p => p.replace("BSc ","") === v) ?? "" : ""); setPage(1); }} />
          <FilterSelect label="Level" options={LEVELS.map(l => `Level ${l}`)} value={level ? `Level ${level}` : ""} onChange={v => { setLevel(v ? v.replace("Level ","") : ""); setPage(1); }} />
          <FilterSelect label="Semester" options={SEMESTERS} value={semester} onChange={v => { setSemester(v); setPage(1); }} />
          <FilterSelect label="Collection" options={COLLECTIONS} value={collection} onChange={v => { setCollection(v); setPage(1); }} />
          <FilterSelect label="Type" options={RESOURCE_TYPES} value={type} onChange={v => { setType(v); setPage(1); }} />

          <div className="flex items-center gap-2 ml-auto">
            <button onClick={clearFilters} className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />Reset
            </button>
            {selected.length > 0 && (
              <button className="text-xs text-red-600 font-medium px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-1.5 border border-red-200 dark:border-red-800">
                <Trash2 className="w-3.5 h-3.5" />Delete ({selected.length})
              </button>
            )}
            <button
              onClick={() => navigate("/admin/upload")}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />Upload Resource
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-sm text-slate-500 dark:text-slate-400">
          Loading resources…
        </div>
      )}

      {/* Table */}
      {!loading && (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {filtered.length} resource{filtered.length !== 1 ? "s" : ""}
            {selected.length > 0 && <span className="text-primary ml-2">· {selected.length} selected</span>}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900/50">
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 w-10">
                  <button onClick={toggleAll}>
                    {allSelected ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4 text-slate-400" />}
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 min-w-[200px]">
                  Resource Title <SortIcon field="title" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  Course <SortIcon field="courseCode" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Collection</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Type</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  Downloads <SortIcon field="downloads" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  Date <SortIcon field="uploadDate" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Status</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map(r => {
                const resourceId = String(r.id);
                const isSel = selected.includes(resourceId);
                const menuOpen = actionMenu?.id === resourceId;
                return (
                  <tr key={r.id} className={`border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors ${isSel ? "bg-primary/5" : ""}`}>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(s => isSel ? s.filter(x => x !== resourceId) : [...s, resourceId])}>
                        {isSel ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4 text-slate-300 dark:text-slate-600" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 max-w-[220px]">
                      <p className="font-semibold text-slate-900 dark:text-white text-xs truncate">{r.title}</p>
                      <p className="text-[11px] text-slate-400 truncate">{shortProg(r.program)}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400" style={MONO}>{r.courseCode}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${badgeClass(r.collection)}`}>{r.collection}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{r.type}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap" style={MONO}>
                      {fmtNum(r.downloads)}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap" style={MONO}>{r.uploadDate}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${statusBadge(r.status)}`}>{r.status}</span>
                    </td>
                    <td className="px-4 py-3 relative">
                      <button
                        onClick={() => setActionMenu(menuOpen ? null : { id: resourceId, open: true })}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {menuOpen && (
                        <div className="absolute right-4 top-9 z-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-xl w-36 py-1" onClick={() => setActionMenu(null)}>
                          {[
                            { label: "View", icon: Eye },
                            { label: "Edit", icon: Edit },
                            { label: "Replace File", icon: RefreshCw },
                            { label: "Delete", icon: Trash2, danger: true },
                          ].map(({ label, icon: Icon, danger }) => (
                            <button key={label} className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${danger ? "text-red-600" : "text-slate-700 dark:text-slate-300"}`}>
                              <Icon className="w-3.5 h-3.5" />{label}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-bold ${page === p ? "bg-primary text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
