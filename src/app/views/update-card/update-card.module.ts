import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateCardRoutingModule } from './update-card-routing.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UpdateCardService } from './update-card.service';
import { UpdateTableComponent } from './update-table/update-table/update-table.component';
import { MatSelectModule } from '@angular/material/select';
import { DetailupdateComponent } from './update-table/detail-update/detailupdate/detailupdate.component';
import { NgPaymentCardModule } from 'ng-payment-card';
import { PopupUpdateComponent } from './update-table/popup-update/popup-update/popup-update.component';
import { NgxTablePopupComponent } from '../cruds/crud-ngx-table/ngx-table-popup/ngx-table-popup.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';


@NgModule({

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    NgPaymentCardModule,
    MatMenuModule,
    MatButtonModule,
    MatChipsModule,
    MatSortModule,
    MatStepperModule,
    MatListModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    TranslateModule,
    SharedModule,
    RouterModule.forChild(UpdateCardRoutingModule)
  ],
  declarations: [UpdateTableComponent,DetailupdateComponent, PopupUpdateComponent],
  providers: [UpdateCardService]
})

export class UpdateCardModule { }
