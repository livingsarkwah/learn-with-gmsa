import { COLLECTION_ACCENT } from "../constants/data";

// ─── Style helpers ────────────────────────────────────────────────────────────

export const MONO: React.CSSProperties = { fontFamily: "var(--font-mono)" };
export const SANS: React.CSSProperties = { fontFamily: "var(--font-family)" };

// ─── Formatting ───────────────────────────────────────────────────────────────

export function fmtNum(n: number): string {
  return n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);
}

export function fmtNumFull(n: number): string {
  return n.toLocaleString();
}

export function shortProg(p: string): string {
  return p
    .replace(/^(Doctor of |Bachelor of |B\.Ed\. |BFA\. |BSc\. |BA\. |LLB |BDS |DVM )/, "")
    .replace(/^BSc |^BA |^BFA /, "");
}

// ─── Badge class ──────────────────────────────────────────────────────────────

export function badgeClass(collection: string): string {
  const c = COLLECTION_ACCENT[collection];
  return c
    ? `${c.badge} ${c.dark}`
    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

// ─── Status badge ─────────────────────────────────────────────────────────────

export function statusBadge(status: string): string {
  switch (status) {
    case "active":    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
    case "inactive":  return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    case "suspended": return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
    case "published": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
    case "draft":     return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";
    default:          return "bg-slate-100 text-slate-600";
  }
}

// ─── Clsx helper ─────────────────────────────────────────────────────────────

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
