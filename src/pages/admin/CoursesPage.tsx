import { useState } from "react";
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { ADMIN_COURSES, PROGRAMS, LEVELS, SEMESTERS } from "../../constants/data";
import { shortProg, MONO, SANS } from "../../utils";

const PAGE_SIZE = 8;

export function CoursesPage() {
  const [search, setSearch]   = useState("");
  const [program, setProgram] = useState("");
  const [level, setLevel]     = useState("");
  const [page, setPage]       = useState(1);

  const filtered = ADMIN_COURSES.filter(c => {
    const q = search.toLowerCase();
    if (search && !c.code.toLowerCase().includes(q) && !c.title.toLowerCase().includes(q)) return false;
    if (program && c.program !== program) return false;
    if (level && c.level !== level) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4" style={SANS}>
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by code or title…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <select value={program} onChange={e => { setProgram(e.target.value); setPage(1); }} className="text-xs border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="">All Programs</option>
          {PROGRAMS.map(p => <option key={p} value={p}>{shortProg(p)}</option>)}
        </select>

        <select value={level} onChange={e => { setLevel(e.target.value); setPage(1); }} className="text-xs border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="">All Levels</option>
          {LEVELS.map(l => <option key={l} value={l}>Level {l}</option>)}
        </select>

        <button className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors">
          <Plus className="w-3.5 h-3.5" />Add Course
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{filtered.length} course{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0">
              <tr className="border-b border-slate-200 dark:border-slate-700">
                {["Course Code", "Course Title", "Program", "Level", "Semester", "Resources", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(c => (
                <tr key={c.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="px-4 py-3 font-bold text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap" style={MONO}>{c.code}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white text-xs max-w-[200px] truncate">{c.title}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 max-w-[160px] truncate">{shortProg(c.program)}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">Level {c.level}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{c.semester}</td>
                  <td className="px-4 py-3 text-xs font-bold text-primary" style={MONO}>{c.resourceCount}</td>
                  <td className="px-4 py-3 text-xs font-bold text-primary" style={MONO}><button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button></td>
        
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {filtered.length === 0 ? "No results" : `Showing ${(page-1)*PAGE_SIZE+1}–${Math.min(page*PAGE_SIZE,filtered.length)} of ${filtered.length}`}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-bold ${page===p ? "bg-primary text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
