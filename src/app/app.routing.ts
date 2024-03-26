import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { PermissionGuard } from './shared/guards/permission.guard';
import { AdminbankGuard } from './shared/guards/adminbank.guard';
import { SimpleuserGuard } from './shared/guards/simpleuser.guard';
import { ChefagenceGuard } from './shared/guards/chefagence.guard';

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
    canActivate: [AuthGuard],
    children: [


      {
        path: 'create',
        loadChildren: () => import('./views/cruds/cruds.module').then(m => m.CrudsModule),
        canActivate: [SimpleuserGuard],
        data: { title: 'Card', breadcrumb: 'Card'}
      },

      

      {
        path: 'update',
        loadChildren: () => import('./views/update-card/update-card.module').then(m => m.UpdateCardModule),
        canActivate: [SimpleuserGuard],
        data: { title: 'Card', breadcrumb: 'Card'}
      },

      
      {
        path: 'pbfcard',
        loadChildren: () => import('./views/PBF/pbf.module').then(m => m.PbfModule),
        canActivate: [ChefagenceGuard],
        data: { title: 'pbf', breadcrumb: 'pbf'}
      },
      {
        path: 'cafcard',
        loadChildren: () => import('./views/CAF/caf.module').then(m => m.CafModule),
        canActivate: [ChefagenceGuard],
        data: { title: 'pbf', breadcrumb: 'pbf'}
      },
      {
        path: 'list',
        loadChildren: () => import('./views/listfile/listefile.module').then(m => m.ListefileModule),
        canActivate: [AdminbankGuard],
        data: { title: 'pbf', breadcrumb: 'pbf'}
      },
      {
        path: 'cafcard',
        loadChildren: () => import('./views/generetepbf/gpbf.module').then(m => m.GpbfModule),
        canActivate: [AdminbankGuard],
        data: { title: 'pbf', breadcrumb: 'pbf', role: ['Admin_Bank']}
      },
      {
        path: 'cafgen',
        loadChildren: () => import('./views/GenertedCaf/gcaf.module').then(m => m.GcafModule),
        canActivate: [AdminbankGuard],
        data: { title: 'pbf', breadcrumb: 'pbf'}
      },

      {
        path: 'gfile',
        loadChildren: () => import('./views/generatefile-ftp/generatedfile.module').then(m => m.GeneratedfileModule),
        canActivate: [PermissionGuard],
        data: { title: 'Card', breadcrumb: 'Card'}
      },
      
      {
        path: 'profile',
        loadChildren: () => import('./views/profile/profile.module').then(m => m.ProfileModule),
  
        data: { title: 'Profile', breadcrumb: 'PROFILE'}
      },



    ]
  },
  {
    path: '**',
    redirectTo: 'sessions/404'
  }
];

