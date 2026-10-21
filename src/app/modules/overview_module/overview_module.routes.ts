import {Routes} from '@angular/router';

export const OverviewModuleRoutes: Routes = [
    {
        path: 'overview',
        loadComponent: () => import('./pages/summary/complete/complete-summary.component').then(m => m.CompleteSummaryComponent),
    },
    {
        path: 'overview/:year/:month',
        loadComponent: () => import('./pages/summary/complete/complete-summary.component').then(m => m.CompleteSummaryComponent),
    },
    {
        path: 'closing/:year',
        loadComponent: () => import('./pages/summary/closing-balance-summary/closing-balance-summary.component').then(m => m.ClosingBalanceSummaryComponent),
    },
];
