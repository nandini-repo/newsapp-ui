import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BookmarkedArticle, NewsArticle } from '../models/news.interface';

@Injectable({
    providedIn: 'root'
})
export class BookmarkService {
    private readonly STORAGE_KEY = 'bookmarked_articles';
    private bookmarkedArticlesSubject = new BehaviorSubject<BookmarkedArticle[]>([]);

    constructor() {
        this.loadBookmarks();
    }

    private loadBookmarks(): void {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            this.bookmarkedArticlesSubject.next(JSON.parse(stored));
        }
    }

    private saveBookmarks(bookmarks: BookmarkedArticle[]): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookmarks));
        this.bookmarkedArticlesSubject.next(bookmarks);
    }

    getBookmarkedArticles(): Observable<BookmarkedArticle[]> {
        return this.bookmarkedArticlesSubject.asObservable();
    }

    isBookmarked(articleId: string): boolean {
        return this.bookmarkedArticlesSubject.value.some(article => article.id === articleId);
    }

    toggleBookmark(article: NewsArticle): void {
        const current = this.bookmarkedArticlesSubject.value;
        const index = current.findIndex(a => a.id === article.id);

        if (index === -1) {
            // Add bookmark
            const bookmarkedArticle: BookmarkedArticle = {
                ...article,
                bookmarkedAt: new Date().toISOString()
            };
            this.saveBookmarks([...current, bookmarkedArticle]);
        } else {
            // Remove bookmark
            const updated = current.filter(a => a.id !== article.id);
            this.saveBookmarks(updated);
        }
    }
} 