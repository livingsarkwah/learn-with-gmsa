import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";
import { createProgram, deleteProgram, getAdminPrograms, getColleges, updateProgram, type AdminProgram, type College } from "../../utils/data/programmes";
import { SANS } from "../../utils";

export function ProgramsPage() {
  const [search, setSearch] = useState("");
  const [programs, setPrograms] = useState<AdminProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [colleges, setColleges] = useState<College[]>([]);
  const [editing, setEditing] = useState<AdminProgram | null | undefined>(undefined);
  const [name, setName] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([getAdminPrograms(), getColleges()])
      .then(([data, nextColleges]) => {if (active) { setPrograms(data); setColleges(nextColleges); }})
      .catch(() => { if (active) setError("Unable to load programmes right now."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  function openCreate() {
    setEditing(null); setName(""); setCollegeId(""); setError("");
  }

  function openEdit(program: AdminProgram) {
    setEditing(program); setName(program.name); setCollegeId(program.collegeId ?? ""); setError("");
  }

  async function saveProgram() {
    if (!name.trim() || !collegeId) { setError("Enter a programme name and college."); return; }
    setSaving(true); setError("");
    try {
      const input = { name: name.trim(), collegeId };
      if (editing) await updateProgram(String(editing.id), input); else await createProgram(input);
      setEditing(undefined);
      const next = await getAdminPrograms();
      setPrograms(next);
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : "Unable to save programme.");
    } finally { setSaving(false); }
  }

  async function removeProgram(program: AdminProgram) {
    if (!window.confirm(`Delete ${program.name}? Programs with courses cannot be deleted.`)) return;
    setError("");
    try { await deleteProgram(String(program.id)); setPrograms(await getAdminPrograms()); }
    catch (mutationError) { setError(mutationError instanceof Error ? mutationError.message : "Unable to delete programme."); }
  }

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
        <button onClick={openCreate} className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl"><Plus className="w-3.5 h-3.5" />Add Programme</button>
      </div>

      {loading && <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-sm text-slate-500">Loading programmes…</div>}
      {error && <div className="bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-sm text-red-600">{error}</div>}

      {(editing !== undefined) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5"><h2 className="font-bold text-slate-900 dark:text-white">{editing ? "Edit Programme" : "Add Programme"}</h2><button onClick={() => setEditing(undefined)}><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Programme name" className="w-full text-sm border rounded-xl px-3 py-2.5 bg-transparent" />
              <select value={collegeId} onChange={e => setCollegeId(e.target.value)} className="w-full text-sm border rounded-xl px-3 py-2.5 bg-transparent"><option value="">Select college</option>{colleges.map(college => <option key={college.id} value={college.id}>{college.name}</option>)}</select>
              <button onClick={() => void saveProgram()} disabled={saving} className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving ? "Saving…" : "Save Programme"}</button>
            </div>
          </div>
        </div>
      )}

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
                            {["College", "Programme Name", "Course Count", "Actions"].map(h => (
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
                  <td className="px-4 py-3"><div className="flex gap-1"><button onClick={() => openEdit(p)} className="p-1.5 text-slate-400 hover:text-primary"><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => void removeProgram(p)} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button></div></td>
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
