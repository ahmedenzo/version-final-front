import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
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
import { PBFdRoutingModule } from './pbf.routing';
import { PbfService } from './pbf.service';
import { CreatepbfComponent } from './createpbf.component';
import { PbfpopupComponent } from './pbf-popup/pbfpopup/pbfpopup.component';
import { FormsModule} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    NgPaymentCardModule,
    MatCheckboxModule,
    MatMenuModule,
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatSortModule,
    MatDialogModule,
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
    RouterModule.forChild(PBFdRoutingModule)
  ],
  declarations: [CreatepbfComponent, PbfpopupComponent],
  providers: [PbfService],
})
export class PbfModule { }
