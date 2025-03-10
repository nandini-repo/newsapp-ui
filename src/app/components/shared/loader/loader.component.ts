import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="loader-overlay" *ngIf="isLoading">
            <div class="loader-container">
                <div class="loader"></div>
                <p class="loader-text">{{ message }}</p>
            </div>
        </div>
    `,
    styles: [`
        .loader-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }

        .loader-container {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        .loader {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }

        .loader-text {
            color: #333;
            font-size: 1.1rem;
            margin: 0;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        [data-theme='dark'] .loader-container {
            background: #2d2d2d;
        }

        [data-theme='dark'] .loader-text {
            color: #ffffff;
        }
    `]
})
export class LoaderComponent {
    @Input() isLoading: boolean = false;
    @Input() message: string = 'Loading...';
} 