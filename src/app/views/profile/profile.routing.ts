import { Routes } from '@angular/router';

import { ProfileComponent } from "./profile.component";
import { ProfileOverviewComponent } from "./profile-overview/profile-overview.component";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { ProfileBlankComponent } from "./profile-blank/profile-blank.component";
import { UserRoleGuard } from 'app/shared/guards/user-role.guard'; 
import { AdminGuard } from 'app/shared/guards/admin.guard';
import { BankComponent } from './BANK/bank/bank.component';


export const ProfileRoutes: Routes = [
  {
    path: '',
    component: ProfileComponent,
 
    children: [{
      path: 'overview',
      component: ProfileOverviewComponent,
       canActivate: [UserRoleGuard],
      
      data: { title: 'Overview', breadcrumb: 'OVERVIEW' }
    }, 

    {
      path: 'settings',
      component: ProfileSettingsComponent,
      data: { title: 'Settings', breadcrumb: 'SETTINGS' }
    }, 
    {
      path: 'SMT',
      component: BankComponent,
      canActivate: [AdminGuard],
      data: { title: 'Overview', breadcrumb: 'OVERVIEW'}
    }, 
    ]
  }
];