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
  },[theme]);

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
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen p-4">
      <h1 className="text-2xl">Book Tracker</h1>

      <button
        onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        className="border px-2 py-1 text-sm">
        {theme === "light" ? "Dark Mode":"Light Mode"}
      </button>

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

      <div className="flex gap-4">
        <div className="flex gap-1">
          <button
            onClick={() => setStatusFilter("all")}
            className="border px-2 py-1 text-sm"
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("to-read")}
            className="border px-2 py-1 text-sm"
          >
            To Read
          </button>
          <button
            onClick={() => setStatusFilter("reading")}
            className="border px-2 py-1 text-sm"
          >
            Reading
          </button>
          <button
            onClick={() => setStatusFilter("finished")}
            className="border px-2 py-1 text-sm"
          >
            Finished
          </button>
        </div>

        <select
          value={sortField}
          onChange={(e) =>
            setSortField(e.target.value as "title" | "author" | "dateAdded")
          }
          className="border px-2 py-1 text-sm"
        >
          <option value="dateAdded">Date Added</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
        </select>

        <button
          onClick={() =>
            setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
          }
          className="border px-2 py-1 text-sm"
        >
          {sortDirection === "asc" ? "↑ Asc" : "↓ Desc"}
        </button>
      </div>

      {visibleBooks.length === 0 ? (
        <p>
          {library.length === 0
            ? "Library is empty."
            : "No books match this filter"}
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
  );
}

export default App;
