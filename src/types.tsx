// book status
export type BookStatus = 'to-read' | 'reading' | 'finished'
export const STATUS_ORDER: BookStatus[] = ['to-read' , 'reading' , 'finished']

export interface SearchResult {
    key: string;
    title: string;
    author: string;
    firstPublishYear: number | null;
    cover_i: number | null;
};

export interface LibraryBook extends SearchResult {
    status: BookStatus;
    rating: number | null;
    id: string;
    dateAdded: number | null;
}

// api types to separate api fetch result and implementation

export interface OpenLibraryData {
    key: string;
    title: string;
    author?: string[];
    firstPublishYear?: number;
    cover_i?: number;
}

export interface OpenLibraryResponse {
    data: OpenLibraryData[];
    numFound: number;
}
