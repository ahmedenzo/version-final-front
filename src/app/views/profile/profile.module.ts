import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgChartsModule } from 'ng2-charts';
import { FileUploadModule } from 'ng2-file-upload';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';
import { ProfileComponent } from "./profile.component";
import { ProfileOverviewComponent } from './profile-overview/profile-overview.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { ProfileBlankComponent } from './profile-blank/profile-blank.component';
import { ProfileRoutes } from "./profile.routing";
import { MatPaginatorModule } from '@angular/material/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { PopUpComponent } from './profile-deux/pop-up/pop-up.component';
import { BankComponent } from './BANK/bank/bank.component';
import { Service } from './profile.service';
import { BankpopupComponent } from './BANK/bank/bank-popup/bankpopup/bankpopup.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ConfigurationComponent } from './BANK/bank/bank-popup/configuration/configuration.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatStepperModule} from '@angular/material/stepper';
import { BinpopupComponent } from './BANK/bank/binpopup/binpopup/binpopup.component';
import { AgencypopupComponent } from './BANK/bank/agencepopup/agencypopup/agencypopup.component';
import { ConfComponent } from './BANK/bank/conf/conf.component';
import { SmptppopupComponent } from './BANK/bank/smptppopup/smptppopup.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatChipsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatTooltipModule,
  
    MatInputModule,
    MatProgressBarModule,
    FlexLayoutModule,
    NgChartsModule,
    FileUploadModule,
    MatStepperModule,
    SharedPipesModule,
    FlexLayoutModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatPaginatorModule,
    TranslateModule,
    
    MatTableModule,
    MatSelectModule,
    MatSlideToggleModule,

    FormsModule,
    RouterModule.forChild(ProfileRoutes)
  ],
  declarations: [ProfileComponent, ProfileOverviewComponent, ProfileSettingsComponent, ProfileBlankComponent, PopUpComponent, BankComponent, BankpopupComponent, ConfigurationComponent, BinpopupComponent, AgencypopupComponent, ConfComponent, SmptppopupComponent],
  providers: [Service]
})
export class ProfileModule { }
