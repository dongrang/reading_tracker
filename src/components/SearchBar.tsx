import { useState } from "react";
import type { SearchResult, OpenLibrarySearchResult } from "../types";
import { mapResults } from "../types";

interface SearchBarProps {
  onAddBook: (book: SearchResult) => void;
  libraryKeys: Set<string>;
}

export default function SearchBar({ onAddBook, libraryKeys }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // api fetch
  async function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(trimmed)}&limit=10`,
      );
      if (!response.ok) {
        throw new Error(`Something went wrong. (${response.status})`);
      }
      const data: OpenLibrarySearchResult = await response.json();
      setResults(data.docs.map(mapResults));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : `Something went wrong searching.`,
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  // initiate search using enter key
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === `Enter`) {
      handleSearch();
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a book title..."
          className="flex-1 border p-2"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="border px-3 py-2"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && results.length === 0 && query.trim() !== "" && (
        <p>No results yet — try searching above.</p>
      )}

      {results.length > 0 && (
        <ul className="mt-2 space-y-2">
          {results.map((book) => {
            const alreadyAdded = libraryKeys.has(book.key);
            return (
              <li key={book.key} className="flex gap-2 border p-2">
                {book.cover_i ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                    alt={`Cover of ${book.title}`}
                    className="w-10 h-14"
                  />
                ) : (
                  <div className="w-10 h-14 border text-xs flex items-center justify-center">
                    No cover
                  </div>
                )}
                <div>
                  <p className="font-medium">{book.title}</p>
                  <p className="text-sm">
                    {book.author}
                    {book.first_publish_year
                      ? ` · ${book.first_publish_year}`
                      : ""}
                  </p>
                  <button
                    onClick={() => onAddBook(book)}
                    disabled={alreadyAdded}
                    className="text-sm border px-2 py-0.5 mt-1"
                  >
                    {alreadyAdded ? "Added" : "Add to library"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
