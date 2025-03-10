import { Routes } from '@angular/router';
import { NewsDashboardComponent } from './components/news-dashboard/news-dashboard.component';

export const routes: Routes = [
    { path: '', component: NewsDashboardComponent },
    { path: '**', redirectTo: '' }
];
