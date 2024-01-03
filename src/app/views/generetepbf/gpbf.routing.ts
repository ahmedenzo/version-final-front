import { Routes } from '@angular/router';
import { GpbfComponent } from './gpbf/gpbf.component';

export const gpbffile: Routes = [
  { 
    path: 'generated-pbf', 
    component: GpbfComponent, 
    data: { title: 'Table', breadcrumb: 'Table' } 
  }
  ,

];