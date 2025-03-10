export interface NewsArticle {
    id?: string;
    title: string;
    summary: string;
    topic: string;
    source: string;
    url: string;
    sentimentScore: number;
    keyEntities: string[];
    publishedDate?: string;
    imageUrl?: string;
}

export type TopicType = 'politics' | 'sports' | 'agriculture' | 'business' | 'technology' | 'entertainment' | 'all';

export interface NewsFilters {
    topic?: TopicType;
    sentimentRange?: {
        min: number;
        max: number;
    };
    dateRange?: {
        start: string;
        end: string;
    };
    searchQuery?: string;
}

export interface BookmarkedArticle extends NewsArticle {
    bookmarkedAt: string;
} 