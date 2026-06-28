// book status
export type BookStatus = "to-read" | "reading" | "finished";
export const STATUS_ORDER: BookStatus[] = ["to-read", "reading", "finished"];

export interface SearchResult {
  key: string;
  title: string;
  author: string;
  first_publish_year: number | null;
  cover_i: number | null;
}

export interface LibraryBook extends SearchResult {
  status: BookStatus;
  rating: number | null;
  id: string;
  dateAdded: number;
}

// function for handling bookstatus
export function moveStatus(current: BookStatus, direction: 1 | -1): BookStatus {
  const currentIndex = STATUS_ORDER.indexOf(current);
  const newIndex = currentIndex + direction;
  //clamp
  if (newIndex < 0 || newIndex >= STATUS_ORDER.length) {
    return current;
  }
  return STATUS_ORDER[newIndex];
}

// api handling

export interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

export interface OpenLibrarySearchResult {
  docs: OpenLibraryDoc[];
  numFound: number;
}

// mapping api response to implementation types

export function mapResults(doc: OpenLibraryDoc): SearchResult {
  return {
    key: doc.key,
    title: doc.title,
    author: doc.author_name?.[0] ?? "Unknown author_name.",
    first_publish_year: doc.first_publish_year ?? null,
    cover_i: doc.cover_i ?? null,
  };
}
