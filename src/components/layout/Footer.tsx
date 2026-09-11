import { useNavigate } from "react-router";
import { BookOpen } from "lucide-react";
import { SANS } from "../../utils";

const LINKS = [
  { title: "Platform", items: [{ label: "Library", path: "/library" }, { label: "Search", path: "/search" }, { label: "Bookmarks", path: "/bookmarks" }] },
  { title: "Programs",  items: [{ label: "Human Biology", path: null }, { label: "Civil Eng.", path: null }, { label: "Computer Science", path: null }, { label: "Electrical & Elec.", path: null }] },
  { title: "Account",   items: [{ label: "Sign In", path: "/login" }, { label: "Help & Support", path: null }, { label: "Privacy Policy", path: null }] },
] as const;

export function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-foreground text-background" style={SANS}>
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><BookOpen className="w-4 h-4 text-white" /></div>
              <span className="font-bold text-sm"><span className="text-primary">Learn</span> with GMSA</span>
            </div>
            <p className="text-sm opacity-60 leading-relaxed max-w-xs">The academic resource platform for KNUST students. Curated by IT&Media, GMSA-KNUST.</p>
          </div>
          {LINKS.map(({ title, items }) => (
            <div key={title}>
              <h4 className="text-[11px] font-bold uppercase tracking-widest opacity-40 mb-3">{title}</h4>
              <ul className="space-y-2">
                {items.map(({ label, path }) => (
                  <li key={label}>
                    {path
                      ? <button onClick={() => navigate(path)} className="text-sm opacity-60 hover:opacity-100 hover:text-primary transition-colors">{label}</button>
                      : <span className="text-sm opacity-60">{label}</span>
                    }
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs opacity-30">
          <span>&copy; {new Date().getFullYear()} GMSA · Ghana Muslim Student Association</span>
          <span>All KNUST programs · All levels</span>
        </div>
      </div>
    </footer>
  );
}
