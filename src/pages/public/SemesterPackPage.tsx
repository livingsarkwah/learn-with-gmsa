import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import JSZip from "jszip";
import {
  ArrowLeft, PackageOpen, ChevronRight, Download,
  FolderOpen, CheckCircle2, FileText, Video, FileQuestion,
} from "lucide-react";
import { COLLEGES, COLLEGE_PROGRAMS, LEVELS, SEMESTERS, COLLECTION_ACCENT } from "../../constants/data";
import { getResources, incrementDownloadCount } from "../../utils/data/resources";
import { academicLabelsMatch } from "../../utils/data/shared";
import { shortProg, badgeClass, MONO, SANS } from "../../utils";
import type { Resource } from "../../types";
import { fetchResourceBlob, sanitizeDownloadFilename } from "../../utils/downloads";

// College colour accents for the step-1 cards
const COLLEGE_PALETTE: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  "College of Agriculture and Natural Resources": { bg: "bg-lime-50 dark:bg-lime-950/50",   border: "border-lime-200 dark:border-lime-800",   text: "text-lime-800 dark:text-lime-300",   icon: "text-lime-600" },
  "College of Humanities and Social Sciences":   { bg: "bg-amber-50 dark:bg-amber-950/50", border: "border-amber-200 dark:border-amber-800", text: "text-amber-800 dark:text-amber-300", icon: "text-amber-600" },
  "College of Engineering":                       { bg: "bg-sky-50 dark:bg-sky-950/50",     border: "border-sky-200 dark:border-sky-800",     text: "text-sky-800 dark:text-sky-300",     icon: "text-sky-600" },
  "College of Art and Built Environment":         { bg: "bg-violet-50 dark:bg-violet-950/50",border: "border-violet-200 dark:border-violet-800",text: "text-violet-800 dark:text-violet-300",icon: "text-violet-600" },
  "College of Science":                           { bg: "bg-emerald-50 dark:bg-emerald-950/50",border: "border-emerald-200 dark:border-emerald-800",text: "text-emerald-800 dark:text-emerald-300",icon: "text-emerald-600" },
  "College of Health Sciences":                   { bg: "bg-rose-50 dark:bg-rose-950/50",   border: "border-rose-200 dark:border-rose-800",   text: "text-rose-800 dark:text-rose-300",   icon: "text-rose-600" },
};

const STEP_LABELS = ["College", "Programme", "Level", "Semester"];

function ResourceTypeIcon({ type }: { type: string }) {
  if (type === "Video")    return <Video       className="w-3.5 h-3.5 text-rose-500" />;
  if (type === "Document") return <FileQuestion className="w-3.5 h-3.5 text-amber-500" />;
  return <FileText className="w-3.5 h-3.5 text-sky-500" />;
}

export function SemesterPackPage() {
  const navigate = useNavigate();
  const [step, setStep]       = useState(0);
  const [college, setCollege] = useState("");
  const [program, setProgram] = useState("");
  const [level, setLevel]     = useState("");
  const [semester, setSemester] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [packProgress, setPackProgress] = useState(0);
  const [packError, setPackError] = useState("");
  const [packStatus, setPackStatus] = useState<"idle" | "downloading" | "complete">("idle");

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

  function selectCollege(c: string)  { setCollege(c); setProgram(""); setLevel(""); setSemester(""); setStep(1); }
  function selectProgram(p: string)  { setProgram(p); setLevel(""); setSemester(""); setStep(2); }
  function selectLevel(l: string)    { setLevel(l); setSemester(""); setStep(3); }
  function selectSemester(s: string) { setSemester(s); setStep(4); }

  function jumpBack(toStep: number) {
    if (toStep < step) setStep(toStep);
  }

  const matches = resources.filter(r => {
    if (college) {
      const cp = COLLEGE_PROGRAMS[college] ?? [];
      const matchesCollege = r.college && academicLabelsMatch(r.college, college);
      const matchesCollegeProgram = cp.some(program => academicLabelsMatch(program, r.program));
      if (!matchesCollege && !matchesCollegeProgram) return false;
    }
    if (program  && !academicLabelsMatch(r.program, program))  return false;
    if (level    && r.level     !== level)    return false;
    if (semester && r.semester  !== semester) return false;
    return true;
  });

  async function downloadPack() {
    if (!matches.length || packStatus === "downloading") return;

    setPackError("");
    setPackStatus("downloading");
    setPackProgress(0);

    const filename = [program || college, `L${level}`, `${semester}Sem`]
      .join("-")
      .replace(/[^a-zA-Z0-9\-]/g, "")
      .replace(/-+/g, "-");
    const zip = new JSZip();
    const archiveNames = new Set<string>();
    const manifest: string[] = [
      "KNUST LEARN - SEMESTER RESOURCE PACK",
      "",
      `College: ${college}`,
      `Programme: ${program || "(All programmes in college)"}`,
      `Level: ${level}`,
      `Semester: ${semester}`,
      `Resources selected: ${matches.length}`,
      "",
      "Files:",
    ];

    function archiveSegment(value: string, fallback: string) {
      return sanitizeDownloadFilename(value, fallback).replace(/\s+/g, " ").trim() || fallback;
    }

    function uniqueArchiveName(directory: string, name: string) {
      const originalName = name;
      let archivePath = `${directory}/${name}`;
      let attempt = 1;
      while (archiveNames.has(archivePath)) {
        const extensionIndex = originalName.lastIndexOf(".");
        const stem = extensionIndex > 0 ? originalName.slice(0, extensionIndex) : originalName;
        const extension = extensionIndex > 0 ? originalName.slice(extensionIndex) : "";
        name = `${stem} (${attempt++})${extension}`;
        archivePath = `${directory}/${name}`;
      }
      archiveNames.add(archivePath);
      return archivePath;
    }

    try {
      for (const [index, resource] of matches.entries()) {
        const resourceLabel = `${resource.title} (${resource.courseCode})`;
        if (resource.type === "Video" || !resource.fileUrl) {
          manifest.push(`- ${resourceLabel}: external video ${resource.fileUrl ?? "URL unavailable"}`);
        } else {
          const extension = resource.type === "PDF" ? "pdf" : "bin";
          const courseFolder = archiveSegment(`${resource.courseCode} - ${resource.courseTitle}`, resource.courseCode || "General");
          const categoryFolder = archiveSegment(resource.collection, "Uncategorized");
          const directory = `files/${courseFolder}/${categoryFolder}`;
          const archivePath = uniqueArchiveName(directory, sanitizeDownloadFilename(resource.fileName, resource.title, extension));
          try {
            const blob = await fetchResourceBlob(resource.fileUrl);
            zip.file(archivePath, blob);
            await incrementDownloadCount(resource.id);
            manifest.push(`- ${resourceLabel}: ${archivePath}`);
          } catch {
            manifest.push(`- ${resourceLabel}: download failed`);
          }
        }
        setPackProgress(Math.round(((index + 1) / matches.length) * 85));
      }

      zip.file("MANIFEST.txt", manifest.join("\n"));
      const blob = await zip.generateAsync(
        { type: "blob", compression: "DEFLATE" },
        metadata => setPackProgress(Math.min(99, 85 + Math.round(metadata.percent * 0.15))),
      );
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `KNUST-Pack-${filename}.zip`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setPackProgress(100);
      setPackStatus("complete");
      toast.success(`Pack downloaded - ${matches.length} resource${matches.length !== 1 ? "s" : ""}`, {
        description: `${program || college} · Level ${level} · ${semester} Semester`,
      });
    } catch {
      setPackError("Unable to create the semester pack. Please try again.");
      setPackStatus("idle");
      setPackProgress(0);
    }
  }

  const programList = college ? (COLLEGE_PROGRAMS[college] ?? []) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-28 md:pb-8" style={SANS}>

      {/* ── Page header ─────────────────────────────── */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <PackageOpen className="w-6 h-6 text-primary" />
            Semester Resource Pack
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Select your college, programme, level and semester to download a zip of that semester's learning resources.
          </p>
        </div>
      </div>

      {/* ── Step breadcrumb ──────────────────────────── */}
      <div className="flex items-center gap-1 mb-8">
        {STEP_LABELS.map((label, i) => {
          const done    = i < step;
          const current = i === step;
          const future  = i > step;
          return (
            <div key={label} className="flex items-center gap-1 flex-1 min-w-0">
              <button
                onClick={() => done && jumpBack(i)}
                disabled={!done}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all truncate
                  ${done    ? "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"  : ""}
                  ${current ? "bg-primary text-white shadow-sm cursor-default"                  : ""}
                  ${future  ? "bg-muted text-muted-foreground cursor-default"                   : ""}
                `}
              >
                {done && <CheckCircle2 className="w-3 h-3 flex-shrink-0" />}
                <span className="hidden sm:inline truncate">{label}</span>
                <span className="sm:hidden">{i + 1}</span>
              </button>
              {i < STEP_LABELS.length - 1 && (
                <ChevronRight className="w-3 h-3 text-border flex-shrink-0" />
              )}
            </div>
          );
        })}
        {/* Results step indicator */}
        <div className="flex items-center gap-1">
          <ChevronRight className="w-3 h-3 text-border flex-shrink-0" />
          <div className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold ${step === 4 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}>
            <span className="hidden sm:inline">Results</span>
            <span className="sm:hidden">5</span>
          </div>
        </div>
      </div>

      {/* ── Step panels ──────────────────────────────── */}

      {loading && (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading available resources…
        </div>
      )}

      {/* Step 0 — Choose college */}
      {!loading && step === 0 && (
        <div>
          <h2 className="text-base font-bold text-foreground mb-4">Which college are you in?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COLLEGES.map(c => {
              const pal = COLLEGE_PALETTE[c] ?? { bg: "bg-muted", border: "border-border", text: "text-foreground", icon: "text-primary" };
              return (
                <button
                  key={c}
                  onClick={() => selectCollege(c)}
                  className={`${pal.bg} ${pal.border} border rounded-2xl p-5 text-left hover:shadow-md transition-all group`}
                >
                  <p className={`font-bold text-sm ${pal.text} group-hover:opacity-90`}>{c}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(COLLEGE_PROGRAMS[c] ?? []).length} programmes
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 1 — Choose programme */}
      {!loading && step === 1 && (
        <div>
          <h2 className="text-base font-bold text-foreground mb-1">Choose your programme</h2>
          <p className="text-xs text-muted-foreground mb-4">{college}</p>
          <div className="bg-card border border-border rounded-2xl overflow-hidden max-h-[420px] overflow-y-auto">
            {programList.map((p, i) => (
              <button
                key={p}
                onClick={() => selectProgram(p)}
                className={`w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-muted transition-colors group ${i < programList.length - 1 ? "border-b border-border" : ""}`}
              >
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{shortProg(p)}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Choose level */}
      {!loading && step === 2 && (
        <div>
          <h2 className="text-base font-bold text-foreground mb-1">What level are you?</h2>
          <p className="text-xs text-muted-foreground mb-4">{shortProg(program)}</p>
          <div className="flex flex-wrap gap-3">
            {LEVELS.map(l => (
              <button
                key={l}
                onClick={() => selectLevel(l)}
                className="flex-1 min-w-[100px] py-5 rounded-2xl border-2 border-border bg-card font-black text-2xl text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 — Choose semester */}
      {!loading && step === 3 && (
        <div>
          <h2 className="text-base font-bold text-foreground mb-1">Which semester?</h2>
          <p className="text-xs text-muted-foreground mb-4">{shortProg(program)} · Level {level}</p>
          <div className="grid grid-cols-2 gap-4">
            {SEMESTERS.map(s => (
              <button
                key={s}
                onClick={() => selectSemester(s)}
                className="py-10 rounded-2xl border-2 border-border bg-card font-bold text-lg text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
              >
                {s}<br />
                <span className="font-normal text-sm text-muted-foreground">Semester</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4 — Results */}
      {!loading && step === 4 && (
        <div>
          {/* Summary + action row */}
          <div className="flex items-start sm:items-center justify-between gap-4 mb-6 flex-col sm:flex-row">
            <div>
              <h2 className="text-base font-bold text-foreground">{matches.length} resource{matches.length !== 1 ? "s" : ""} found</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {shortProg(program)} · Level {level} · {semester} Semester
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setStep(0)}
                className="px-3 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
              >
                Start over
              </button>
              {matches.length > 0 && (
                <button
                  onClick={() => void downloadPack()}
                  disabled={packStatus === "downloading"}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                >
                  <Download className="w-4 h-4" />
                  {packStatus === "downloading" ? "Building ZIP…" : packStatus === "complete" ? "Download Again" : "Download Pack"}
                </button>
              )}
            </div>
          </div>

          {packStatus === "downloading" && (
            <div className="mb-5 rounded-xl border border-border bg-card p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Building ZIP pack</span>
                <span>{packProgress}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-[width] duration-200" style={{ width: `${packProgress}%` }} />
              </div>
            </div>
          )}
          {packError && <p className="mb-5 text-sm text-destructive">{packError}</p>}

          {matches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FolderOpen className="w-14 h-14 text-muted-foreground/20 mb-4" />
              <p className="font-bold text-foreground mb-1">No resources found</p>
              <p className="text-sm text-muted-foreground mb-4">
                No resources are available for this combination yet.
              </p>
              <button
                onClick={() => setStep(0)}
                className="text-sm text-primary font-semibold hover:underline"
              >
                Try a different combination
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {matches.map((r, i) => {
                const accent = COLLECTION_ACCENT[r.collection];
                return (
                  <div
                    key={r.id}
                    className="bg-card border border-border rounded-xl px-4 py-3.5 flex items-start gap-3 hover:shadow-sm transition-all"
                  >
                    <span className="text-xs font-bold text-muted-foreground w-5 flex-shrink-0 pt-0.5" style={MONO}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{r.title}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs font-bold text-muted-foreground" style={MONO}>{r.courseCode}</span>
                        <span className="text-muted-foreground/40 text-xs">·</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${accent ? `${accent.badge} ${accent.dark}` : "bg-muted text-muted-foreground"}`}>
                          {r.collection}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 pt-0.5">
                      <ResourceTypeIcon type={r.type} />
                      <span className="text-xs text-muted-foreground" style={MONO}>{r.type}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
