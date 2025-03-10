import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsService } from '../../services/news.service';
import { BookmarkService } from '../../services/bookmark.service';
import { ThemeService, Theme } from '../../services/theme.service';
import { NewsArticle, NewsFilters, TopicType } from '../../models/news.interface';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
// Temporarily commented out loader
// import { LoaderComponent } from '../shared/loader/loader.component';

@Component({
    selector: 'app-news-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './news-dashboard.component.html',
    styleUrls: ['./news-dashboard.component.scss']
})
export class NewsDashboardComponent implements OnInit, OnDestroy {
    articles: NewsArticle[] = [];
    filteredArticles: NewsArticle[] = [];
    displayedArticles: NewsArticle[] = [];
    topics: string[] = [];
    loading = false;
    error = '';
    currentTheme: Theme = 'light';
    private searchSubject = new Subject<string>();
    private searchSubscription?: Subscription;
    readonly articleLimit = 12;
    
    filters: NewsFilters = {
        topic: 'all',
        sentimentRange: { min: -1, max: 1 },
        dateRange: {
            start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0]
        },
        searchQuery: ''
    };

    constructor(
        private newsService: NewsService,
        private bookmarkService: BookmarkService,
        private themeService: ThemeService
    ) {
        this.setupSearchSubscription();
    }

    private setupSearchSubscription() {
        this.searchSubscription = this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(searchQuery => {
            this.filters.searchQuery = searchQuery;
            this.applyFilters();
        });
    }

    ngOnInit() {
        this.loadInitialData();
        this.setupTheme();
    }

    ngOnDestroy() {
        if (this.searchSubscription) {
            this.searchSubscription.unsubscribe();
        }
    }

    private setupTheme() {
        this.themeService.getTheme().subscribe(theme => {
            this.currentTheme = theme;
        });
    }

    private loadInitialData() {
        this.loading = true;
        this.error = '';
        
        // Load topics and articles in parallel
        Promise.all([
            this.newsService.getTopics().toPromise(),
            this.newsService.getNews().toPromise()
        ]).then(([topics, articles]) => {
            this.topics = topics || [];
            this.articles = articles || [];
            this.updateDisplayedArticles(this.articles);
            this.loading = false;
        }).catch(error => {
            console.error('Error loading data:', error);
            this.error = 'Failed to load data';
            this.loading = false;
        });
    }

    private updateDisplayedArticles(articles: NewsArticle[]) {
        this.filteredArticles = articles;
        this.displayedArticles = articles
            .sort((a, b) => new Date(b.publishedDate || '').getTime() - new Date(a.publishedDate || '').getTime())
            .slice(0, this.articleLimit);
    }

    applyFilters() {
        this.loading = true;
        this.error = '';
        
        this.newsService.getNews(this.filters).subscribe({
            next: (articles) => {
                this.updateDisplayedArticles(articles);
                this.loading = false;
            },
            error: (error) => {
                console.error('Error applying filters:', error);
                this.error = 'Failed to apply filters';
                this.loading = false;
            }
        });
    }

    onSearch(query: string) {
        console.log('Search query:', query); // Debug log
        this.searchSubject.next(query);
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggleBookmark(article: NewsArticle) {
        this.bookmarkService.toggleBookmark(article);
    }

    isBookmarked(articleId: string): boolean {
        return this.bookmarkService.isBookmarked(articleId);
    }

    shareArticle(article: NewsArticle) {
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: article.summary,
                url: article.url
            }).catch(console.error);
        } else {
            // Fallback to copying to clipboard
            navigator.clipboard.writeText(article.url)
                .then(() => alert('Link copied to clipboard!'))
                .catch(console.error);
        }
    }

    getSentimentColor(score: number): string {
        if (score > 0.5) return '#4CAF50';
        if (score > 0) return '#8BC34A';
        if (score === 0) return '#9E9E9E';
        if (score > -0.5) return '#FFA726';
        return '#F44336';
    }
} 