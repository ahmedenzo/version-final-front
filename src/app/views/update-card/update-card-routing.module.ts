
import { Routes } from '@angular/router';
import { UpdateTableComponent } from './update-table/update-table/update-table.component';
import { DetailupdateComponent } from './update-table/detail-update/detailupdate/detailupdate.component';

export const UpdateCardRoutingModule: Routes = [
  { 
    path: 'update-card', 
    component: UpdateTableComponent, 
    data: { title: 'Table', breadcrumb: 'Table' } 
  }
  ,
  {
    path: ":id",
    component: DetailupdateComponent ,
    pathMatch: "full"
  }
];