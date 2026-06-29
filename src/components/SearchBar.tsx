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
  const [hasSearched,setHasSearched] = useState(false);

  // api fetch
  async function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;

    setHasSearched(true);
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

  // function for clearing search results
  function handleClearResults() {
    setResults([]);
    setError(null);
    setHasSearched(false);
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a book title..."
          className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900
                     px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm
                     hover:bg-gray-100 dark:hover:bg-gray-800
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     disabled:opacity-50 disabled:hover:bg-transparent"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {!loading && !error && results.length === 0 && hasSearched && (
        <p className="text-sm text-gray-500 dark:text-gray-400">No results.</p>
      )}

      {results.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Results
            </p>
            <button
              onClick={handleClearResults}
              aria-label="Close search results"
              className="rounded-md px-2 py-1 text-sm text-gray-500 dark:text-gray-400
                         hover:bg-gray-100 dark:hover:bg-gray-800
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              ✕
            </button>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {results.map((book) => {
              const alreadyAdded = libraryKeys.has(book.key);
              return (
                <li
                  key={book.key}
                  className="flex gap-2 rounded-md border border-gray-200 dark:border-gray-800 p-2"
                >
                  {book.cover_i ? (
                    <img
                      src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                      alt={`Cover of ${book.title}`}
                      className="w-10 h-14 object-cover rounded shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-14 shrink-0 rounded border border-gray-200 dark:border-gray-700 text-xs text-gray-400 flex items-center justify-center">
                      No cover
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug truncate">
                      {book.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {book.author}
                      {book.first_publish_year
                        ? ` · ${book.first_publish_year}`
                        : ""}
                    </p>
                    <button
                      onClick={() => onAddBook(book)}
                      disabled={alreadyAdded}
                      className="mt-1 rounded-md border border-gray-300 dark:border-gray-700
                                 px-2 py-0.5 text-xs
                                 hover:bg-gray-100 dark:hover:bg-gray-800
                                 focus:outline-none focus:ring-2 focus:ring-blue-500
                                 disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      {alreadyAdded ? "Added" : "Add to library"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
