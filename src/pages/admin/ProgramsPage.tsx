import { useState } from "react";
import { Search, Plus, Edit, Trash2, GraduationCap } from "lucide-react";
import { ADMIN_PROGRAMS } from "../../constants/data";
import { MONO, SANS } from "../../utils";

export function ProgramsPage() {
  const [search, setSearch] = useState("");

  const filtered = ADMIN_PROGRAMS.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.college.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4" style={SANS}>
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search programs…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors">
          <Plus className="w-3.5 h-3.5" />Add Program
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Programs",  value: ADMIN_PROGRAMS.length, icon: GraduationCap },
          { label: "Total Courses",   value: ADMIN_PROGRAMS.reduce((s, p) => s + p.courseCount, 0), icon: null },
          { label: "Total Resources", value: ADMIN_PROGRAMS.reduce((s, p) => s + p.resourceCount, 0), icon: null },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4">
            <p className="text-xl font-black text-slate-900 dark:text-white" style={MONO}>{value.toLocaleString()}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{filtered.length} program{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0">
              <tr className="border-b border-slate-200 dark:border-slate-700">
                {["Program Name", "College", "Courses", "Resources", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white text-xs">{p.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{p.college}</td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300" style={MONO}>{p.courseCount}</td>
                  <td className="px-4 py-3 text-xs font-bold text-primary" style={MONO}>{p.resourceCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-bold text-primary" style={MONO}>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
