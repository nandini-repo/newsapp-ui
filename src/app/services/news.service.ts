import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewsArticle, NewsFilters } from '../models/news.interface';

@Injectable({
    providedIn: 'root'
})
export class NewsService {
    //private apiUrl = 'http://localhost:3020/api'; // Your backend URL
    private apiUrl = 'https://news-app-zeta-orpin.vercel.app/api'; // Your backend URL
    constructor(private http: HttpClient) {}

    getNews(filters?: NewsFilters): Observable<NewsArticle[]> {
        let url = `${this.apiUrl}/news`;
        if (filters) {
            const params = new URLSearchParams();
            if (filters.topic && filters.topic !== 'all') {
                params.append('topic', filters.topic);
            }
            if (filters.searchQuery?.trim()) {
                params.append('search', filters.searchQuery.trim());
            }
            if (filters.sentimentRange) {
                params.append('minSentiment', filters.sentimentRange.min.toString());
                params.append('maxSentiment', filters.sentimentRange.max.toString());
            }
            if (filters.dateRange) {
                params.append('startDate', filters.dateRange.start);
                params.append('endDate', filters.dateRange.end);
            }
            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
        }
        console.log('API URL:', url); // Debug log
        return this.http.get<NewsArticle[]>(url);
    }

    getTopics(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/topics`);
    }
} 