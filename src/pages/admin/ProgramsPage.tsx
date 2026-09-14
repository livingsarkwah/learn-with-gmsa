import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getAdminPrograms, type AdminProgram } from "../../utils/getData";
import { SANS } from "../../utils";

export function ProgramsPage() {
  const [search, setSearch] = useState("");
  const [programs, setPrograms] = useState<AdminProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAdminPrograms()
      .then(data => {if (active) setPrograms(data);})
      .catch(() => { if (active) setError("Unable to load programmes right now."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = programs.filter(p =>
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
        <span className="ml-auto text-xs text-slate-400">Read-only until authentication is enabled</span>
      </div>

      {loading && <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-sm text-slate-500">Loading programmes…</div>}
      {error && <div className="bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-sm text-red-600">{error}</div>}

      {/* Table */}
      {!loading && !error && (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{filtered.length} program{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0">
              <tr className="border-b border-slate-200 dark:border-slate-700">
                {["College", "Programme Name", "Course Count"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{p.college}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white text-xs">{p.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{p.courseCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
      {!loading && !error && filtered.length === 0 && <div className="text-center py-10 text-sm text-slate-500">No programmes found.</div>}
    </div>
  );
}
