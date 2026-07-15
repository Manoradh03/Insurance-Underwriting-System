import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
  path: 'admin',
  canActivate: [adminGuard],
  loadComponent: () =>
    import('./pages/admin/admin.component')
      .then(m => m.AdminComponent)
},
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'apply', loadComponent: () => import('./pages/new-application/new-application.component').then(m => m.NewApplicationComponent) },
      { path: 'my-applications', loadComponent: () => import('./pages/my-applications/my-applications.component').then(m => m.MyApplicationsComponent) },
      { path: 'applications/:id', loadComponent: () => import('./pages/application-detail/application-detail.component').then(m => m.ApplicationDetailComponent) },
      {
        path: 'underwriter',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/underwriter-dashboard/underwriter-dashboard.component').then(m => m.UnderwriterDashboardComponent)
      },
      {
        path: 'underwriter/review/:id',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/underwriter-review/underwriter-review.component')
            .then(m => m.UnderwriterReviewComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
