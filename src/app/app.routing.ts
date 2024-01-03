import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { PermissionGuard } from './shared/guards/permission.guard';

export const rootRouterConfig: Routes = [
  {
    path: '',
    redirectTo: 'sessions/signin',
    pathMatch: 'full'
  },

  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: () => import('./views/sessions/sessions.module').then(m => m.SessionsModule),
        data: { title: 'Session'}
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [PermissionGuard],
        data: { title: 'Dashboard', breadcrumb: 'DASHBOARD', role: ['Admin_SMT','Admin_Bank','Admin_Agence','Simple_User'] }
      },

      {
        path: 'create',
        loadChildren: () => import('./views/cruds/cruds.module').then(m => m.CrudsModule),
        canActivate: [PermissionGuard],
        data: { title: 'Card', breadcrumb: 'Card', role: ['Admin_SMT','Admin_Bank','Simple_User']}
      },

      

      {
        path: 'update',
        loadChildren: () => import('./views/update-card/update-card.module').then(m => m.UpdateCardModule),
        canActivate: [PermissionGuard],
        data: { title: 'Card', breadcrumb: 'Card', role: ['Admin_SMT','Simple_User','Admin_Bank']}
      },

      
      {
        path: 'pbfcard',
        loadChildren: () => import('./views/PBF/pbf.module').then(m => m.PbfModule),
        canActivate: [PermissionGuard],
        data: { title: 'pbf', breadcrumb: 'pbf', role: ['Admin_SMT','Admin_Bank']}
      },
      {
        path: 'cafcard',
        loadChildren: () => import('./views/CAF/caf.module').then(m => m.CafModule),
        canActivate: [PermissionGuard],
        data: { title: 'pbf', breadcrumb: 'pbf', role: ['Admin_SMT','Admin_Bank']}
      },
      {
        path: 'list',
        loadChildren: () => import('./views/listfile/listefile.module').then(m => m.ListefileModule),
        canActivate: [PermissionGuard],
        data: { title: 'pbf', breadcrumb: 'pbf', role: ['Admin_SMT','Admin_Bank']}
      },
      {
        path: 'cafcard',
        loadChildren: () => import('./views/generetepbf/gpbf.module').then(m => m.GpbfModule),
        canActivate: [PermissionGuard],
        data: { title: 'pbf', breadcrumb: 'pbf', role: ['Admin_SMT','Admin_Bank']}
      },
      {
        path: 'cafgen',
        loadChildren: () => import('./views/GenertedCaf/gcaf.module').then(m => m.GcafModule),
        canActivate: [PermissionGuard],
        data: { title: 'pbf', breadcrumb: 'pbf', role: ['Admin_SMT','Admin_Bank']}
      },

      {
        path: 'gfile',
        loadChildren: () => import('./views/generatefile-ftp/generatedfile.module').then(m => m.GeneratedfileModule),
        canActivate: [PermissionGuard],
        data: { title: 'Card', breadcrumb: 'Card', role: ['Admin_SMT','Admin_Bank']}
      },
      
      {
        path: 'profile',
        loadChildren: () => import('./views/profile/profile.module').then(m => m.ProfileModule),
        canActivate: [PermissionGuard],
        data: { title: 'Profile', breadcrumb: 'PROFILE', role: ['Admin_SMT','Admin_Bank','Simple_User']}
      },
  

    ]
  },
  {
    path: '**',
    redirectTo: 'sessions/404'
  }
];

