import { useNavigate } from "react-router";
import { Home, Library, Search, Bookmark, User } from "lucide-react";
import { SANS } from "../../utils";

interface Props {
  pathname: string;
  bookmarks: number[];
}

const ITEMS = [
  { path: "/",          label: "Home",    Icon: Home },
  { path: "/library",   label: "Library",  Icon: Library },
  { path: "/search",    label: "Search",   Icon: Search },
  { path: "/bookmarks", label: "Saved",    Icon: Bookmark, badge: true },
  { path: "/login",     label: "Account",  Icon: User },
];

function isActive(pathname: string, path: string) {
  if (path === "/") return pathname === "/";
  return pathname.startsWith(path);
}

export function MobileBottomNav({ pathname, bookmarks }: Props) {
  const navigate = useNavigate();
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border"
      style={SANS}
    >
      <div className="flex items-stretch h-16">
        {ITEMS.map(({ path, label, Icon, badge }) => {
          const active = isActive(pathname, path);
          const count  = badge ? bookmarks.length : 0;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
            >
              <div className={`relative p-1 rounded-lg ${active ? "bg-primary/10" : ""}`}>
                <Icon className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold ${active ? "text-primary" : ""}`}>{label}</span>
              {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
