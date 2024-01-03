
import { Routes } from '@angular/router';
import { GeneratedfileComponent } from './generatedfile/generatedfile/generatedfile.component';

export const generatedfile: Routes = [
  { 
    path: 'generated-card', 
    component: GeneratedfileComponent, 
    data: { title: 'Table', breadcrumb: 'Table' } 
  }
  ,

];