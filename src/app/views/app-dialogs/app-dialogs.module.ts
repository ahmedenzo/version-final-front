import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { LoaderDialogComponent } from './loader-dialog/loader-dialog.component';
import { DialogsRoutes } from "./app-dialogs.routing";
import { FileConfirmDialogComponent } from './FileConfirm/file-confirm-dialog/file-confirm-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatDialogModule,
    SharedModule,
    RouterModule.forChild(DialogsRoutes)
  ],
  declarations: [ConfirmDialogComponent, LoaderDialogComponent, FileConfirmDialogComponent]
})
export class AppDialogsModule { }
