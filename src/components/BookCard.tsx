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
    <div className="border p-2">
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

      <p className="font-medium">{book.title}</p>
      <p className="text-sm">
        {book.author}
        {book.first_publish_year ? ` . ${book.first_publish_year}` : ""}
      </p>

      <p className="text-sm">Status: {book.status}</p>

      <div className="flex gap-2">
        <button
          onClick={() => onChangeStatus(book.id, -1)}
          disabled={!canGoBack}
          className="border px-2 py-0.5 text-sm"
        >
          Back
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onChangeStatus(book.id, +1)} 
          disabled={!canGoForward}
          className="border px-2 py-0.5 text-sm"
        >
          Forward
        </button>
      </div>

      {book.status === "finished" && (
        <div className="flex gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onSetRating(book.id, star)}
              className="text-sm"
            >
              {book.rating !== null && star <= book.rating ? "★" : "☆"}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => onRemove(book.id)}
        className="border px-2 py-0.5 text-sm mt-1"
      >
        Delete
      </button>
    </div>
  );
}
