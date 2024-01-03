
import { Routes } from '@angular/router';
import { CreatepbfComponent } from './createpbf.component';


export const PBFdRoutingModule: Routes = [
  { 
    path: 'pbf-class', 
    component: CreatepbfComponent, 
    data: { title: 'Table', breadcrumb: 'Table' } 
  }
  

];