import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () =>
            import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
            },
            {
                path: 'total-production',
                loadComponent: () =>
                    import('./features/total-production/total-production.component').then((m) => m.TotalProductionComponent),
            },
            {
                path: 'percent-electrical',
                loadComponent: () =>
                    import('./features/percent-electrical/percent-electrical.component').then((m) => m.PercentElectricalComponent),
            },
            {
                path: 'trend',
                loadComponent: () =>
                    import('./features/trend/trend.component').then((m) => m.TrendComponent),
            },
            {
                path: 'top-countries',
                loadComponent: () =>
                    import('./features/top-countries/top-countries.component').then((m) => m.TopCountriesComponent),
            },
            {
                path: 'participation',
                loadComponent: () =>
                    import('./features/participation/participation.component').then((m) => m.ParticipationComponent),
            },
            {
                path: 'about-us',
                loadComponent: () =>
                    import('./features/about-us/about-us.component').then((m) => m.AboutUsComponent),
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'auth/login',
    },
];
