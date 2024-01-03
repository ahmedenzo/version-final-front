
import { Routes } from '@angular/router';
import { GcafComponent } from './gcaf/gcaf.component';

export const gcafdfile: Routes = [
  { 
    path: 'generated-caf', 
    component: GcafComponent, 
    data: { title: 'Table', breadcrumb: 'Table' } 
  }
  ,

];