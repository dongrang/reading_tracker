import type { LibraryBook } from "../types";

interface BookCardProps {
  book: LibraryBook;
  onChangeStatus: (id: string, direction: 1 | -1) => void;
  onSetRating: (id: string, rating: number) => void;
  onRemove: (id: string) => void;
}

export default function BookCard({
  book,
  onChangeStatus,
  onSetRating,
  onRemove,
}: BookCardProps) {
  const canGoBack = book.status !== "to-read";
  const canGoForward = book.status !== "finished";

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 flex gap-3">
      {book.cover_i ? (
        <img
          src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
          alt={`Cover of ${book.title}`}
          className="w-20 h-28 object-cover rounded-md flex-shrink-0"
        />
      ) : (
        <div className="w-20 h-28 flex-shrink-0 rounded-md border border-gray-200 dark:border-gray-700 text-xs text-gray-400 flex items-center justify-center">
          No cover
        </div>
      )}

      <div className="flex-1 min-w-0 space-y-1.5">
        <p className="font-medium leading-snug">{book.title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {book.author}
          {book.first_publish_year ? ` · ${book.first_publish_year}` : ""}
        </p>
        <p className="text-sm capitalize text-gray-600 dark:text-gray-300">
          Status: {book.status}
        </p>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onChangeStatus(book.id, -1)}
            disabled={!canGoBack}
            className="rounded-md border border-gray-300 dark:border-gray-700 px-2 py-1 text-sm
                       hover:bg-gray-100 dark:hover:bg-gray-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       disabled:opacity-40 disabled:hover:bg-transparent"
          >
            ← Back
          </button>
          <button
            onClick={() => onChangeStatus(book.id, 1)}
            disabled={!canGoForward}
            className="rounded-md border border-gray-300 dark:border-gray-700 px-2 py-1 text-sm
                       hover:bg-gray-100 dark:hover:bg-gray-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       disabled:opacity-40 disabled:hover:bg-transparent"
          >
            Forward →
          </button>
        </div>

        {book.status === "finished" && (
          <div className="flex gap-0.5 pt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => onSetRating(book.id, star)}
                className="text-lg leading-none hover:scale-110 transition-transform
                           focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              >
                {book.rating !== null && star <= book.rating ? "★" : "☆"}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => onRemove(book.id)}
          className="rounded-md border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400
                     px-2 py-1 text-sm mt-1
                     hover:bg-red-50 dark:hover:bg-red-950
                     focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
