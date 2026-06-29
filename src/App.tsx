import { useState, useEffect, useMemo } from "react";
import type { BookStatus, LibraryBook, SearchResult } from "./types";
import { moveStatus } from "./types";
import SearchBar from "./components/SearchBar";
import StatsBar from "./components/StatsBar";
import BookCard from "./components/BookCard";

// persistence
const STORAGE_KEY = "book-tracker:library";
function loadLibrary(): LibraryBook[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

// dark mode
const THEME_KEY = "book-tracker:theme";
function loadTheme(): "light" | "dark" {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    return raw === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

//////////////////
// App function //
//////////////////
function App() {
  const [library, setLibrary] = useState<LibraryBook[]>(loadLibrary);
  const [statusFilter, setStatusFilter] = useState<BookStatus | "all">("all");
  const [sortField, setSortField] = useState<"title" | "author" | "dateAdded">(
    "dateAdded",
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // themeing states
  const [theme, setTheme] = useState<"light" | "dark">(loadTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  }, [library]);

  function addBook(book: SearchResult) {
    setLibrary((prev) => {
      if (prev.some((b) => b.key === book.key)) return prev;
      const newBook: LibraryBook = {
        ...book,
        id: book.key,
        status: "to-read",
        rating: null,
        dateAdded: Date.now(),
      };
      return [...prev, newBook];
    });
  }

  function removeBook(id: string) {
    setLibrary((prev) => prev.filter((b) => b.id !== id));
  }

  function changeStatus(id: string, direction: 1 | -1) {
    setLibrary((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: moveStatus(b.status, direction) } : b,
      ),
    );
  }

  function setRating(id: string, rating: number) {
    setLibrary((prev) => prev.map((b) => (b.id === id ? { ...b, rating } : b)));
  }

  // without useMemo the filtering/sorting logic would rerun on every single render even if
  // library or statusFilter hadn't changed
  // useMemo only redoes the work if library, statusFilter, sortField, or sortDirection changed
  const visibleBooks = useMemo(() => {
    const filtered =
      statusFilter === "all"
        ? library
        : library.filter((b) => b.status === statusFilter);

    return [...filtered].sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1;
      if (sortField === "dateAdded") return (a.dateAdded - b.dateAdded) * dir;
      return a[sortField].localeCompare(b[sortField]) * dir;
    });
  }, [library, statusFilter, sortField, sortDirection]);

  // filtering the library array for stats
  const stats = useMemo(() => {
    const toRead = library.filter((b) => b.status === "to-read").length;
    const reading = library.filter((b) => b.status === "reading").length;
    const finishedBooks = library.filter((b) => b.status === "finished");
    const ratedBooks = finishedBooks.filter((b) => b.rating != null);
    const avgRating = ratedBooks.length
      ? ratedBooks.reduce((sum, b) => sum + (b.rating ?? 0), 0) /
        ratedBooks.length
      : null;
    return {
      toRead,
      reading,
      finishedCount: finishedBooks.length,
      avgRating,
    };
  }, [library]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Book Tracker</h1>
          <button
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm
                       hover:bg-gray-100 dark:hover:bg-gray-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </header>

        <SearchBar
          onAddBook={addBook}
          libraryKeys={new Set(library.map((b) => b.key))}
        />

        <StatsBar
          toRead={stats.toRead}
          reading={stats.reading}
          finished={stats.finishedCount}
          avgRating={stats.avgRating}
        />

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(["all", "to-read", "reading", "finished"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    statusFilter === s
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
              >
                {s === "all"
                  ? "All"
                  : s === "to-read"
                    ? "To Read"
                    : s === "reading"
                      ? "Reading"
                      : "Finished"}
              </button>
            ))}
          </div>

          <select
            value={sortField}
            onChange={(e) =>
              setSortField(e.target.value as "title" | "author" | "dateAdded")
            }
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900
                       px-3 py-1.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       ml-20"
          >
            <option value="dateAdded">Date Added</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>

          <button
            onClick={() =>
              setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
            }
            className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm
                       hover:bg-gray-100 dark:hover:bg-gray-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortDirection === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>

        {visibleBooks.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">
            {library.length === 0
              ? "Your library is empty — search for a book above to get started."
              : "No books match this filter."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onChangeStatus={changeStatus}
                onSetRating={setRating}
                onRemove={removeBook}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
