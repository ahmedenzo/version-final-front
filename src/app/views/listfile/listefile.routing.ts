
import { Routes } from '@angular/router';
import { ListefileComponent } from './listefile/listefile.component';


export const listefileRoutingModule: Routes = [
  { 
    path: 'listefile', 
    component: ListefileComponent, 
    data: { title: 'Table', breadcrumb: 'Table' } 
  }
  

];