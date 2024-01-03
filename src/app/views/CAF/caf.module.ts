import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaftableComponent } from './caftable/caftable.component';
import { PbfService } from '../PBF/pbf.service';
import { CAFRoutingModule } from './caf.routing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'app/shared/shared.module';
import { NgPaymentCardModule } from 'ng-payment-card';




@NgModule({
  declarations: [
    CaftableComponent,

  ],
  providers: [PbfService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    NgPaymentCardModule,
    MatMenuModule,
    FormsModule,
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
    RouterModule.forChild(CAFRoutingModule)
  ]
})
export class CafModule { }
