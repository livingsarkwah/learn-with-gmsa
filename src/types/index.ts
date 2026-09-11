// ─── Routing ──────────────────────────────────────────────────────────────────

export type AppMode   = "public" | "admin";
export type PublicPage = "home" | "library" | "details" | "search" | "bookmarks" | "login";
export type AdminPage  = "dashboard" | "resources" | "upload" | "programs" | "courses" | "analytics" | "settings";

// ─── Domain ───────────────────────────────────────────────────────────────────

export interface Resource {
  id: number;
  title: string;
  courseCode: string;
  courseTitle: string;
  program: string;
  collection: string;
  type: "PDF" | "Video" | "Document";
  downloads: number;
  views: number;
  tags: string[];
  description: string;
  level: string;
  semester: string;
  featured?: boolean;
  uploadDate: string;
  status: "published" | "draft";
}

export interface Course {
  id: number;
  code: string;
  title: string;
  program: string;
  level: string;
  semester: string;
  resourceCount: number;
}

export interface Program {
  id: number;
  name: string;
  college: string;
  courseCount: number;
  resourceCount: number;
}

export interface Member {
  id: number;
  studentId: string;
  name: string;
  program: string;
  level: string;
  lastLogin: string;
  status: "active" | "inactive" | "suspended";
  joinDate: string;
}

export interface Filters {
  college: string;
  program: string;
  level: string;
  semester: string;
  collection: string;
  type: string;
  courseSearch: string;
}

// ─── Charts ───────────────────────────────────────────────────────────────────

export interface MonthlyDownloadPoint {
  month: string;
  downloads: number;
  uploads: number;
}

export interface CategoryPoint {
  name: string;
  value: number;
  color: string;
}
