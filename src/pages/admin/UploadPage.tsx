import { useEffect, useState, useRef } from "react";
import { Upload, X, FileText, CheckCircle, ChevronDown } from "lucide-react";
import { COLLEGE_PROGRAMS, COLLECTIONS, RESOURCE_TYPES, COLLEGES } from "../../constants/data";
import { createAdminResource } from "../../utils/data/resources";
import { getCategories, getResourceCollections, type Category, type ResourceCollection } from "../../utils/data/catalog";
import { getCoursesByProgramId, type AdminCourse } from "../../utils/data/courses";
import { getAdminPrograms, type AdminProgram } from "../../utils/data/programmes";
import { SANS } from "../../utils";

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
      <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-5 pb-3 border-b border-slate-100 dark:border-slate-700">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SelectField({ label, options, value, onChange, required, disabled, placeholder }: {
  label: string; options: readonly string[]; value: string; onChange: (v: string) => void; required?: boolean; disabled?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-3.5 py-2.5 pr-9 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
          style={SANS}
        >
          <option value="">{placeholder ?? `Select ${label}…`}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

function TextField({ label, placeholder, value, onChange, multiline, required }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void; multiline?: boolean; required?: boolean;
}) {
  const cls = "w-full text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";
  return (
    <div>
      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4} className={cls} style={SANS} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} style={SANS} />
      }
    </div>
  );
}

export function UploadPage() {
  const [college, setCollege]       = useState("");
  const [program, setProgram]       = useState("");
  const [course, setCourse]         = useState("");
  const [collection, setCollection] = useState("");
  const [category, setCategory] = useState("");
  const [resType, setResType]       = useState("");
  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags]             = useState("");
  const [uploading, setUploading]   = useState(false);
  const [fileName, setFileName]     = useState("");
  const [message, setMessage]       = useState("");
  const [error, setError]           = useState("");
  const [file, setFile]             = useState<File | null>(null);
  const [courses, setCourses]       = useState<AdminCourse[]>([]);
  const [programs, setPrograms]     = useState<AdminProgram[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<ResourceCollection[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void Promise.all([getAdminPrograms(), getCategories(), getResourceCollections()])
      .then(([nextPrograms, nextCategories, nextCollections]) => {
        setPrograms(nextPrograms);
        setCategories(nextCategories);
        setCollections(nextCollections);
      })
      .catch(() => setError("Unable to load upload options. Check the Supabase connection."));
  }, []);

  useEffect(() => {
    const selectedProgram = programs.find(item => item.name === program && item.college === college);
    setCourses([]);
    setCourse("");
    if (!selectedProgram) return;
    void getCoursesByProgramId(String(selectedProgram.id))
      .then(setCourses)
      .catch(() => setError("Unable to load courses for this programme."));
  }, [college, program, programs]);

  function selectFile(nextFile: File) {
    setError("");
    if (nextFile.size > 200 * 1024 * 1024) {
      setError("The selected file exceeds the 200 MB limit.");
      return;
    }
    const allowed = ["application/pdf", "video/mp4", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
    if (!allowed.includes(nextFile.type)) {
      setError("Choose a PDF, MP4, DOCX, PPTX, or XLSX file.");
      return;
    }
    setFile(nextFile);
    setFileName(nextFile.name);
  }

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) selectFile(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) selectFile(file);
  }

  async function handleSave(status: "draft" | "published") {
    setError("");
    setMessage("");
    const selectedCourse = courses.find(item => String(item.id) === course);
    const selectedCollection = collections.find(item => item.name === collection);
    const selectedCategory = categories.find(item => item.id === category);
    const type = resType.toLowerCase() as "pdf" | "video" | "document";
    if (!file || !college || !program || !selectedCourse || !selectedCollection || !selectedCategory || !title.trim() || !type) {
      setError("Complete all required fields and select a valid file before saving.");
      return;
    }

    setUploading(true);
    try {
      await createAdminResource(file, {
        title: title.trim(),
        description: description.trim(),
        categoryId: selectedCategory.id,
        courseId: String(selectedCourse.id),
        collectionId: selectedCollection.id,
        resourceType: type,
        tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
        status,
      });
      setMessage(status === "draft" ? "Draft saved successfully." : "Resource published successfully.");
      setFile(null);
      setFileName("");
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : "Unable to save the resource.");
    } finally {
      setUploading(false);
    }
  }

  const programOptions = college
    ? programs.filter(item => item.college === college).map(item => item.name)
    : [];

  return (
    <div className="max-w-3xl space-y-5" style={SANS}>
      {/* Academic information */}
      <FormSection title="Academic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField label="College"             options={COLLEGES}    value={college}     onChange={value => { setCollege(value); setProgram(""); setCourse(""); }} required />
          <SelectField label="Program"             options={programOptions.length ? programOptions : (COLLEGE_PROGRAMS[college] ?? [])} value={program}  onChange={value => { setProgram(value); setCourse(""); }} required disabled={!college} placeholder={college ? "Select Program…" : "Select College first"} />
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">Course<span className="text-red-500 ml-0.5">*</span></label>
            <select value={course} onChange={e => setCourse(e.target.value)} disabled={!program} className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 disabled:opacity-60">
              <option value="">{program ? "Select Course…" : "Select Program first"}</option>
              {courses.map(option => <option key={option.id} value={option.id}>{option.code} — {option.title}</option>)}
            </select>
          </div>
          <SelectField label="Resource Collection" options={collections.length ? collections.map(item => item.name) : COLLECTIONS} value={collection} onChange={setCollection} required />
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">Category<span className="text-red-500 ml-0.5">*</span></label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full appearance-none text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
              <option value="">Select Category…</option>
              {categories.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </div>
        </div>
      </FormSection>

      {/* Resource information */}
      <FormSection title="Resource Information">
        <TextField label="Resource Title"  placeholder="e.g. Fluid Mechanics — Complete Lecture Notes" value={title}       onChange={setTitle}       required />
        <TextField label="Description"     placeholder="Describe the content and scope of this resource…" value={description} onChange={setDescription} multiline />
        <TextField label="Tags"            placeholder="comma-separated tags: fluid, mechanics, ME 305, bernoulli" value={tags} onChange={setTags} />
        <SelectField label="Resource Type" options={RESOURCE_TYPES} value={resType} onChange={setResType} required />
      </FormSection>

      {/* Upload section */}
      <FormSection title="File Upload">
        {/* Main upload area */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${fileName ? "border-primary/40 bg-primary/5" : "border-slate-200 dark:border-slate-600 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-900"}`}
          onDragOver={e => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => !fileName && fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" className="hidden" onChange={handleFileSelect} accept=".pdf,.mp4,.docx,.pptx,.xlsx" />
          {fileName ? (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{fileName}</p>
                {!uploading && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 mt-1">
                    <CheckCircle className="w-3.5 h-3.5" />Upload complete
                  </p>
                )}
              </div>
              <button
                onClick={e => { e.stopPropagation(); setFile(null); setFileName(""); }}
                className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 mx-auto"
              >
                <X className="w-3.5 h-3.5" />Remove file
              </button>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-7 h-7 text-slate-400" />
              </div>
              <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Drag & drop your file here</p>
              <p className="text-xs text-slate-400 mb-3">or click to browse from your computer</p>
              <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 px-3 py-1.5 rounded-lg">
                PDF, MP4, DOCX, PPTX, XLSX · Max 200 MB
              </span>
            </>
          )}
        </div>

      </FormSection>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {message && <p className="text-sm text-emerald-600 dark:text-emerald-400">{message}</p>}

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => void handleSave("draft")}
          disabled={uploading}
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          {uploading ? "Saving…" : "Save Draft"}
        </button>
        <button
          onClick={() => void handleSave("published")}
          disabled={uploading}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-black hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
        >
          {uploading ? "Publishing…" : <><Upload className="w-4 h-4" />Publish Resource</>}
        </button>
        <button className="px-4 py-2.5 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}
