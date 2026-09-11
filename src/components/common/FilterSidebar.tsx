import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import type { Filters } from "../../types";
import { PROGRAMS, LEVELS, SEMESTERS, COLLECTIONS, RESOURCE_TYPES, COLLECTION_ACCENT, COLLEGES, COLLEGE_PROGRAMS } from "../../constants/data";
import { shortProg, SANS } from "../../utils";

interface Props {
  filters: Filters;
  setFilters: (f: Filters) => void;
  onClose?: () => void;
}

function Section({ id, label, open, onToggle, children }: {
  id: string; label: string; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-3 space-y-0.5">{children}</div>}
    </div>
  );
}

function Option({ field, value, label, filters, setFilters }: {
  field: keyof Filters; value: string; label?: string; filters: Filters; setFilters: (f: Filters) => void;
}) {
  const on = filters[field] === value;
  return (
    <button
      onClick={() => setFilters({ ...filters, [field]: on ? "" : value })}
      className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors ${on ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
    >
      {label ?? value}
    </button>
  );
}

// Short label for college names in the sidebar
const COLLEGE_SHORT: Record<string, string> = {
  "College of Agriculture and Natural Resources": "Agriculture & Natural Resources",
  "College of Humanities and Social Sciences":   "Humanities & Social Sciences",
  "College of Engineering":                       "Engineering",
  "College of Art and Built Environment":         "Art & Built Environment",
  "College of Science":                           "Science",
  "College of Health Sciences":                   "Health Sciences",
};

export function FilterSidebar({ filters, setFilters, onClose }: Props) {
  const [open, setOpen] = useState<string[]>(["college", "program", "level", "collection"]);
  const toggle = (s: string) => setOpen(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const activeCount = Object.values(filters).filter(Boolean).length;

  function clearAll() {
    setFilters({ college: "", program: "", level: "", semester: "", collection: "", type: "", courseSearch: "" });
  }

  // When a college is selected, cascade to show only that college's programs
  const visiblePrograms = filters.college
    ? (COLLEGE_PROGRAMS[filters.college] ?? [])
    : PROGRAMS;

  return (
    <div style={SANS}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
          <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
          Filters
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">{activeCount}</span>
          )}
        </span>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button onClick={clearAll} className="text-xs text-primary hover:underline">Clear</button>
          )}
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1 rounded-md hover:bg-muted"><X className="w-4 h-4" /></button>
          )}
        </div>
      </div>

      {/* Course search */}
      <div className="mb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={filters.courseSearch}
            onChange={e => setFilters({ ...filters, courseSearch: e.target.value })}
            placeholder="Course name or code…"
            className="w-full pl-8 pr-3 py-2 text-xs bg-muted rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Filter sections */}
      <div>
        {/* College — clicking a college also resets program */}
        <Section id="college" label="College" open={open.includes("college")} onToggle={() => toggle("college")}>
          <div className="space-y-0.5">
            {COLLEGES.map(c => {
              const on = filters.college === c;
              return (
                <button
                  key={c}
                  onClick={() => setFilters({ ...filters, college: on ? "" : c, program: "" })}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                    on
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {COLLEGE_SHORT[c] ?? c}
                </button>
              );
            })}
          </div>
        </Section>

        <Section id="program" label="Programme" open={open.includes("program")} onToggle={() => toggle("program")}>
          <div className="max-h-44 overflow-y-auto space-y-0.5 pr-0.5">
            {visiblePrograms.map(p => (
              <Option key={p} field="program" value={p} label={shortProg(p)} filters={filters} setFilters={setFilters} />
            ))}
          </div>
        </Section>

        <Section id="level" label="Level" open={open.includes("level")} onToggle={() => toggle("level")}>
          {LEVELS.map(l => (
            <Option key={l} field="level" value={l} label={`Level ${l}`} filters={filters} setFilters={setFilters} />
          ))}
        </Section>

        <Section id="semester" label="Semester" open={open.includes("semester")} onToggle={() => toggle("semester")}>
          {SEMESTERS.map(s => (
            <Option key={s} field="semester" value={s} label={`${s} Semester`} filters={filters} setFilters={setFilters} />
          ))}
        </Section>

        <Section id="collection" label="Collection" open={open.includes("collection")} onToggle={() => toggle("collection")}>
          {COLLECTIONS.map(c => (
            <div key={c} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLLECTION_ACCENT[c]?.dot ?? "#888" }} />
              <Option field="collection" value={c} filters={filters} setFilters={setFilters} />
            </div>
          ))}
        </Section>

        <Section id="type" label="Resource Type" open={open.includes("type")} onToggle={() => toggle("type")}>
          {RESOURCE_TYPES.map(t => (
            <Option key={t} field="type" value={t} filters={filters} setFilters={setFilters} />
          ))}
        </Section>
      </div>
    </div>
  );
}
