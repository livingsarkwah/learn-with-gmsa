import { Navbar } from "../components/layout/Navbar";
import { MobileBottomNav } from "../components/layout/MobileBottomNav";
import type { PublicPage } from "../types";

interface Props {
  page: PublicPage;
  setPage: (p: PublicPage) => void;
  dark: boolean;
  toggleDark: () => void;
  bookmarks: number[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearch: (q: string) => void;
  children: React.ReactNode;
}

export function PublicLayout({
  page, setPage, dark, toggleDark, bookmarks,
  searchQuery, setSearchQuery, onSearch, children,
}: Props) {
  return (
    <>
      <Navbar
        page={page}
        setPage={setPage}
        dark={dark}
        toggleDark={toggleDark}
        bookmarks={bookmarks}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={onSearch}
      />
      <main className="pb-16 md:pb-0">{children}</main>
      <MobileBottomNav page={page} setPage={setPage} bookmarks={bookmarks} />
    </>
  );
}
