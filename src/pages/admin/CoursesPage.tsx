import { useEffect, useState } from "react";
import { Plus, Search, ChevronLeft, ChevronRight, Pencil, Trash2, X } from "lucide-react";
import { PROGRAMS, LEVELS } from "../../constants/data";
import { createCourse, deleteCourse, getAdminCourses, updateCourse, type AdminCourse } from "../../utils/data/courses";
import { getPrograms, type Program } from "../../utils/data/programmes";
import { academicLabelsMatch } from "../../utils/data/shared";
import { shortProg, MONO, SANS } from "../../utils";

const PAGE_SIZE = 8;

export function CoursesPage() {
  const [search, setSearch]   = useState("");
  const [program, setProgram] = useState("");
  const [level, setLevel]     = useState("");
  const [page, setPage]       = useState(1);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [programs, setPrograms] = useState<Program[]>([]);
  const [editing, setEditing] = useState<AdminCourse | null | undefined>(undefined);
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [programId, setProgramId] = useState("");
  const [courseLevel, setCourseLevel] = useState("100");
  const [semester, setSemester] = useState("1");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([getAdminCourses(), getPrograms()])
      .then(([data, nextPrograms]) => { if (active) { setCourses(data); setPrograms(nextPrograms); } })
      .catch(() => { if (active) setError("Unable to load courses right now."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  function openCreate() {
    setEditing(null); setCode(""); setTitle(""); setProgramId(""); setCourseLevel("100"); setSemester("1"); setError("");
  }

  function openEdit(course: AdminCourse) {
    setEditing(course); setCode(course.code); setTitle(course.title); setProgramId(course.programId ?? ""); setCourseLevel(course.level); setSemester(course.semester === "First" ? "1" : "2"); setError("");
  }

  async function saveCourse() {
    if (!code.trim() || !title.trim() || !programId) { setError("Enter a course code, title, and programme."); return; }
    setSaving(true); setError("");
    try {
      const input = { code: code.trim().toUpperCase(), title: title.trim(), programId, level: Number(courseLevel), semester: Number(semester) };
      if (editing) await updateCourse(String(editing.id), input); else await createCourse(input);
      setEditing(undefined);
      setCourses(await getAdminCourses());
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : "Unable to save course.");
    } finally { setSaving(false); }
  }

  async function removeCourse(course: AdminCourse) {
    if (!window.confirm(`Delete ${course.code} - ${course.title}?`)) return;
    setError("");
    try { await deleteCourse(String(course.id)); setCourses(await getAdminCourses()); }
    catch (mutationError) { setError(mutationError instanceof Error ? mutationError.message : "Unable to delete course."); }
  }

  const filtered = courses.filter(c => {
    const q = search.toLowerCase();
    if (search && !c.code.toLowerCase().includes(q) && !c.title.toLowerCase().includes(q)) return false;
    if (program && !academicLabelsMatch(c.program, program)) return false;
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

        <button onClick={openCreate} className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl"><Plus className="w-3.5 h-3.5" />Add Course</button>
      </div>

      {loading && <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-sm text-slate-500">Loading courses…</div>}
      {error && <div className="bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-sm text-red-600">{error}</div>}

      {editing !== undefined && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5"><h2 className="font-bold text-slate-900 dark:text-white">{editing ? "Edit Course" : "Add Course"}</h2><button onClick={() => setEditing(undefined)}><X className="w-5 h-5" /></button></div>
            <div className="space-y-3">
              <input value={code} onChange={e => setCode(e.target.value)} placeholder="Course code" className="w-full text-sm border rounded-xl px-3 py-2.5 bg-transparent" />
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Course title" className="w-full text-sm border rounded-xl px-3 py-2.5 bg-transparent" />
              <select value={programId} onChange={e => setProgramId(e.target.value)} className="w-full text-sm border rounded-xl px-3 py-2.5 bg-transparent"><option value="">Select programme</option>{programs.map(program => <option key={program.id} value={program.id}>{program.name}</option>)}</select>
              <div className="grid grid-cols-2 gap-3"><select value={courseLevel} onChange={e => setCourseLevel(e.target.value)} className="text-sm border rounded-xl px-3 py-2.5 bg-transparent">{LEVELS.map(level => <option key={level} value={level}>Level {level}</option>)}</select><select value={semester} onChange={e => setSemester(e.target.value)} className="text-sm border rounded-xl px-3 py-2.5 bg-transparent"><option value="1">First semester</option><option value="2">Second semester</option></select></div>
              <button onClick={() => void saveCourse()} disabled={saving} className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving ? "Saving…" : "Save Course"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
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
                  <td className="px-4 py-3"><div className="flex gap-1"><button onClick={() => openEdit(c)} className="p-1.5 text-slate-400 hover:text-primary"><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => void removeCourse(c)} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button></div></td>
        
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
      )}
    </div>
  );
}
