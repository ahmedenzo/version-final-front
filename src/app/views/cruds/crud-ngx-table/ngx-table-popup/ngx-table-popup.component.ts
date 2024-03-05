import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormGroup, UntypedFormControl, Validators, ValidationErrors, AbstractControl, FormControl } from '@angular/forms';
import { RenewOption, updatecode, CardProcessIndicator,TerritoryCode ,Sourcecode,PKIiNDICATOR,ACS, CardHolder} from 'app/shared/models/Cardholder';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { reverseUpdateCode, reverseCardProcessIndicator, reverseACS, reverseSourceCode, reversePKIIndicator, reverseTerritoryCode, reverseRenewOption } from '../../FormHelper';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { Notifications2Service } from 'app/shared/components/egret-notifications2/notifications2.service';


import { CrudService } from '../../crud.service';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { Bin } from 'app/shared/models/bank';


export function   dateRangeValidator(): ValidationErrors | null {
  const startDate = this.basicForms.controls['date1'].value;
  const endDate = this.basicForms.controls['date2'].value;
  
  if (startDate && endDate && startDate >= endDate) {
      return { 'dateInvalid': true };
  }
  
  return null;
}


export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

interface Country {
  name: string;
  code: string;
}


const nameValidator = (control: AbstractControl): ValidationErrors | null => {
  const name = control.value as string;
  const uppercaseName = name.toUpperCase();

  if (name !== uppercaseName) {
    control.setValue(uppercaseName);
  }

  return null;
};




@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './ngx-table-popup.component.html',
  styleUrls: ['./ngx-pop.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_FORMATS
    }
  ],
})
export class NgxTablePopupComponent implements OnInit {
  showPassportField: boolean = false;
  formData = {};
  selectedBinId: number; 
  currentDate: moment.Moment;
  julianDate: string;
  batchSequence: number = 1;
  countryCodes: Country[] = [];
  selectedCountry: string;
  phoneNumber: string;
  cardValueE: string;
  cardValue: string;
  countries: Country[];
  states: string[];
  showPopup = false;
  date1  : UntypedFormControl
  date2: UntypedFormControl;
  basicForm: UntypedFormGroup;
  basicForms: UntypedFormGroup;
  console = console;
  renewOption: string[];
  renewOptionsvalue: number ;
  updatecode: any[] 
  updateCodeValues: number ;
  TerritoryCodevalue: number ;
  
  CardProcessIndicatorValues: any ;
  cardProcessIndicator: string[];
  sourcecode: any[] 
  Sourcecodevalue: number ;
  pkiindicator: any[]
  PKIiNDICATORvalue: number ;
  ACS: any[]
  ACSCodevalue: string ;
  operatorUserCode: any;
  FreesCode: any;
  secondAccount: any;
  Pinoffset: any;
  BankIdCode:any;
  birthDate: any;
  postalCode: any;
  passportId: any;
  statuscard : any;
  av:any
  ledgbals:any
  isLinear: any;
  isCardRequired = false; 
  username:any
  userr:any
  bankname:any
  bins: any


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NgxTablePopupComponent>,
    private http: HttpClient, private jwtAuth: JwtAuthService,private Notifications2Service:Notifications2Service,private CrudService:CrudService
  ) { }
  
  ngOnInit() {
    this.username =this.jwtAuth.getUser()

    this.getBankName()

  

  

    if (!this.data.isNew || this.data.isupdated) {
      
      this.formData = {
        name: this.data.payload.name,
        birthDate: this.data.payload.birthDate,
        cityCode: this.data.payload.cityCode,
        firstAccount: this.data.payload.firstAccount,
        territorycode: this.data.payload.territorycode,
      

      
        corporateName: this.data.payload.corporateName,
        address : this.data.payload.address,
        postalCode: this.data.payload.postalCode,
        cin: this.data.payload.cin,
        passportId: this.data.payload.passportId,
        email: this.data.payload.email,
    
        phoneNumber: this.data.payload.phoneNumber,
        countryPhonecode: this.data.payload.countryPhonecode,
        updatecode: this.data.payload.updatecode,
      
        sourcecode: this.data.payload.sourcecode,
 

        bin:this.data.payload.bin ,
      

      
        

      };
     
   
     
     
    
    
    
    }
   
    if (this.data.isupdated) {
      this.updatecode = [updatecode.Card_Update]; 
      this.cardProcessIndicator = [CardProcessIndicator.Personalization_Only]; 
      this.ACS = [ACS.TO_NOT_ENROLL_IN_ACS]; 
      this.pkiindicator =  [PKIiNDICATOR.PKI_CARD]
  





    } else {
      this.updatecode = Object.values(updatecode).filter((value) => value !== updatecode.Card_First_Creation)
      this.cardProcessIndicator= Object.values(CardProcessIndicator).filter((value) => value !== CardProcessIndicator.Personalization_Only && value !== CardProcessIndicator.Card_Perso_And_Pin_Mailer_Print );
      this.ACS= Object.values(ACS)
    }


     
     this.getCountryCodes();
     this.currentDate = moment();
    
  
   
   
     this.sourcecode = Object.values(Sourcecode); 








    this.isLinear = false;
     this.basicForm = new UntypedFormGroup({
   
      updatecode: new UntypedFormControl(''),
     
      cardtype:  new UntypedFormControl(''),
      bin  :  new UntypedFormControl('', [Validators.required]),
      Card: new UntypedFormControl(''),
      countryCode: new UntypedFormControl(''),

      statuscard: new UntypedFormControl(''),

 

    

  
      sourcecode: new UntypedFormControl(this.initializesourcecodeControl(), [Validators.required]),
      territorycode: new UntypedFormControl(''),

    

   
 


      firstAccount: new UntypedFormControl({ value: '', disabled: true },
      ),

      address: new UntypedFormControl(this.getFormDataValue('address') || '', [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern('[a-zA-Z0-9 ]*'),
        nameValidator,
      ]),
 
      

      corporateName: new UntypedFormControl(this.getFormDataValue('corporateName') || '', [
   
        Validators.pattern('[a-zA-Z ]*'),
        nameValidator,
      ]),

      name: new UntypedFormControl(this.getFormDataValue('name') || '', [
        Validators.required,
        Validators.pattern('[a-zA-Z ]*'),
        nameValidator,
      ]),
   
      phoneNumber: new FormControl(  this.getFormDataValue('phoneNumber') || '', [Validators.required]),
      countryPhonecode: new UntypedFormControl( this.getFormDataValue('countryPhonecode') || '', [Validators.required]),
    
      birthDate : new UntypedFormControl(this.getFormDataValue('birthDate') || '',[Validators.required]),
      cin: new UntypedFormControl(this.getFormDataValue('cin') ||'', [
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(8),
        Validators.maxLength(16),
    
      ]),
      passportId: new UntypedFormControl(this.getFormDataValue('passportId') || '', [
        Validators.pattern('[a-zA-Z0-9 ]*'),
        Validators.minLength(8),
        Validators.maxLength(10),
        Validators.required,
        nameValidator,
      ]),
     
    
  
      email: new UntypedFormControl(this.getFormDataValue('email') || '', [Validators.required, Validators.email]),
   
    });
  }

  
  getBankName() {
    this.jwtAuth.getBankNameByUsername(this.username).subscribe((data: any) => {
      this.bankname = data;
   
      this.getbin(); 
    });
  }
  
  getbin() {
    if (this.bankname) { 
      this.CrudService.getBinsByBank(this.bankname.bankname).subscribe((data: any) => {
        this.bins = data;
      });
    } else {

    }
  }


  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, control: FormControl) {
    const ctrlValue = control.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    control.setValue(ctrlValue);
    datepicker.close();
  }


  



  submitForm() 
{
    if (this.data.payload.isNew && this.basicForm.valid) {
 
    
        this.generateValueSourceCode();
        this.generateValueTerritory();
   
       
       
        this.basicForm.patchValue({
      
          sourcecode: this.Sourcecodevalue,
        
      
          statuscard: updatecode.Card_First_Creation,
      
      
        });
        const cardHolder = this.basicForm.value;
     
   
      

      
  
      this.dialogRef.close(cardHolder);


 



    }  else if (this.basicForm.valid){
      
  
  
      this.generateValueSourceCode();
      this.generateValueTerritory();
    
  
      this.basicForm.patchValue({
        sourcecode: this.Sourcecodevalue,
      
 

        statuscard: updatecode.Card_First_Creation,
      });
  
      const cardHolder = this.basicForm.value;
  
   
  
      const finalPayload = {
        cardHolder,
      

      }
  
   
      this.dialogRef.close(finalPayload);
    }
  
  }


    initializeUpdateCodeControl() {
      if (!this.data.isNew && !this.data.isAddMode) {
        return reverseUpdateCode(this.data.payload.updatecode);
      } else {
        return '';
       
      }
    } 
    initializecardProcessIndicatoreControl() {
      if (!this.data.isNew && !this.data.isAddMode) {
        return reverseCardProcessIndicator(this.data.payload.cardProcessIndicator);
      } else {
        return '';
       
      }
    } 
  
    initializerenewOptionControl() {
      if (!this.data.isNew && !this.data.isAddMode) {
        return reverseRenewOption(this.data.payload.renewOption);
      } else {
        return '';
       
      }
    } 
    initializerterritorycodeControl() {
      if (!this.data.isNew && !this.data.isAddMode) {
        return reverseTerritoryCode(this.data.payload.territorycode);
      } else {
        return '';
       
      }
    } 
    initializesourcecodeControl() {
      if (!this.data.isNew && !this.data.isAddMode) {
        return reverseSourceCode(this.data.payload.sourcecode);
      } else {
        return '';
       
      }
    } 
    initializeracseControl() {
      if (!this.data.isNew && !this.data.isAddMode) {
        return reverseACS(this.data.payload.acs);
      } else {
        return '';
       
      }
    } 
    initializerpkiControl() {
      if (!this.data.isNew && !this.data.isAddMode) {
        return reversePKIIndicator(this.data.payload.pkiindicator);
      } else {
        return '';
       
      }
    } 


  getCountryCodes(): void {
    this.http.get<Country[]>('/assets/country-codes.json').subscribe(
      (data) => {
        this.countryCodes = data;
      },
      (error) => {

      }
    );
    }

    getFormDataValue(key: string): any {
      return this.formData ? this.formData[key] : null;
    }



    generateValueCardProcessIndicator() {
      const formValue = this.basicForm.get("cardProcessIndicator").value.toString();
    
      if (formValue) {
      
    
      
        if (formValue === CardProcessIndicator.Pin_Mailer_Reminder.toString()) {
          this.CardProcessIndicatorValues = "D";
        } else if (formValue === CardProcessIndicator.Pin_Offset_Update.toString()) {
          this.CardProcessIndicatorValues = "P";
        } else if (formValue === CardProcessIndicator.Card_Perso_And_Pin_Mailer_Print.toString()) {
          this.CardProcessIndicatorValues = "D";
        } else if (formValue === CardProcessIndicator.Personalization_Only.toString()) {
          this.CardProcessIndicatorValues = "F";
        } else if (formValue === CardProcessIndicator.Card_Cancellation.toString()) {
          this.CardProcessIndicatorValues = "N";
        } else if (formValue === CardProcessIndicator.CVV2_Mailer_Reminder.toString()) {
          this.CardProcessIndicatorValues = "V";
        } else if (formValue === CardProcessIndicator.Any_Other_Updated_Field.toString()) {
          this.CardProcessIndicatorValues = "";
        }
      } else {
     
      }
    
    
    }
  
    generateValueAcs() {
      const formValue = this.basicForm.get("acs").value.toString();
    
      if (formValue) {
      
    
     
        if (formValue === ACS.TO_ENROLL_IN_ACS.toString()) {
          this.ACSCodevalue = "E";
        } else if (formValue === ACS.Modification.toString()) {
          this.ACSCodevalue = "M";
        } else if (formValue === ACS.ACS_Code_Reminder.toString()) {
          this.ACSCodevalue = "C";
        } else if (formValue === ACS.ACS_Deletion.toString()) {
          this.ACSCodevalue = "S";
        } 
         else if (formValue === ACS.TO_NOT_ENROLL_IN_ACS.toString()) {
          this.ACSCodevalue = "";
        }
      } else {
      
      }
    
    
    }
  
    generateValue() {
      const formValue = this.basicForm.get("updatecode").value.toString();
    
      if (formValue) {

    
        if (formValue === updatecode.Card_First_Creation.toString()) {
         
          this.updateCodeValues = 1;
        } else if (formValue === updatecode.Card_Update.toString()) {
     
          this.updateCodeValues = 2;
        } else if (formValue === updatecode.Card_Cancellation.toString()) {
        
          this.updateCodeValues = 3;
        } else if (formValue === updatecode.Card_Renewal.toString()) {
       
          this.updateCodeValues = 4;
        }
      } else {
       
      }
    
  
    }
    
    generateValueSourceCode() {
      const formValue = this.basicForm.get("sourcecode").value.toString();
    
      if (formValue) {
   
    
        if (formValue === Sourcecode.Individual.toString()) {
          
          this.Sourcecodevalue = 1;
        } else if (formValue === Sourcecode.BankStaff.toString()) {
          
          this.Sourcecodevalue = 2;
        } else if (formValue === Sourcecode.Corporate.toString()) {
        
          this.Sourcecodevalue = 3;
        } 
      } else {
     
      }
    
      
    }

    generateValueTerritory() {
      const formValue = this.basicForm.get("territorycode").value.toString();
    
      if (formValue) {
 
    
        if (formValue === TerritoryCode.International.toString()) {
        
          this.TerritoryCodevalue = 2;
        } else if (formValue === TerritoryCode.National.toString()) {
        
          this.TerritoryCodevalue = 1;
        }
      } else {

      }
    
      
    }
    generateValuerenewoption() {
      const formValue = this.basicForm.get("renewOption").value.toString();
    
      if (formValue) {
 
    
        if (formValue === RenewOption.To_Be_Renewed_After_Expiration.toString()) {
         
          this.renewOptionsvalue = 0;
        } else if (formValue === RenewOption.Not_To_Be_Renewed.toString()) {
          
          this.renewOptionsvalue = 1;
        }
      } else {
       
      }
    
   
    }
    generateValuePKi() {
      const formValue = this.basicForm.get("pkiindicator").value.toString();
    
      if (formValue) {
       
    
        if (formValue === PKIiNDICATOR.PKI_CARD.toString()) {
          
          this.PKIiNDICATORvalue = 0;
        } else if (formValue === PKIiNDICATOR.NOT_PKI_CARD.toString()) {
          
          this.PKIiNDICATORvalue = 1;
        } 
      } else {
       
      }
    
      
    }
  
   
  

    

  }