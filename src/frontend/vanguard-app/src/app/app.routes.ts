import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'landing',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'workflows',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/workflows/workflows.component').then(m => m.WorkflowsComponent)
  },
  {
    path: 'workflows/:id/designer',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/workflows/workflow-designer/workflow-designer.component').then(m => m.WorkflowDesignerComponent)
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tasks/tasks.component').then(m => m.TasksComponent)
  },
  {
    path: 'requests',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/requests/requests.component').then(m => m.RequestsComponent)
  },
  {
    path: 'monitoring',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/monitoring/monitoring.component').then(m => m.MonitoringComponent)
  },
  {
    path: 'audit-center',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/audit-center/audit-center.component').then(m => m.AuditCenterComponent)
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent)
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
