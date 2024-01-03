
import { Routes } from '@angular/router';
import { CaftableComponent } from './caftable/caftable.component';

export const CAFRoutingModule: Routes = [
  { 
    path: 'caf-class', 
    component: CaftableComponent, 
    data: { title: 'Table', breadcrumb: 'Table' } 
  }
  

];