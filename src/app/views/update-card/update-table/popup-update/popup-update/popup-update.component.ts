import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PKIiNDICATOR, RenewOption, Sourcecode, TerritoryCode ,updatecode,CardProcessIndicator} from 'app/shared/models/Cardholder';
import { reverseSourceCode,reverseTerritoryCode,reverseRenewOption, reverseCardProcessIndicator } from 'app/views/cruds/FormHelper';
import { UpdateCardService } from 'app/views/update-card/update-card.service';
import { Moment } from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

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

@Component({
  selector: 'app-popup-update',
  templateUrl: './popup-update.component.html',
  styleUrls: ['./popup-update.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PopupUpdateComponent implements OnInit {
  public itemForm: FormGroup;
  username:any
  userr:any
  bankname:any
  bins: any;
  binId: any;
  formData = {};

  currentDate: moment.Moment;

  countryCodes: Country[] = [];
  selectedCountry: string;
  phoneNumber: string;
  cardValueE: string;
  cardValue: string;
  countries: Country[];
  states: string[];
  showPopup = false;

  console = console;
  renewOptionsvalue: number ;
  TerritoryCodevalue: number ;
  updateCodeValues: number ;
  CardProcessIndicatorValues: any ;
  statuscard : any;
  Sourcecodevalue: number ;
  PKIiNDICATORvalue: number ;
  operatorUserCode: any;
  secondAccount: any;
  BankIdCode:any;
  birthDate: any;
  territorycode= Object.values(TerritoryCode);
  renewOption = Object.values(RenewOption);
  sourcecode = Object.values(Sourcecode); 
  pkiindicator = Object.values(PKIiNDICATOR); 
  updatecode = Object.values(updatecode)
  cardProcessIndicator = Object.values(CardProcessIndicator)
  isLinear: any;
  av: any;
  ledgbals: any;

  constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<PopupUpdateComponent>,
  private fb: FormBuilder, private jwtAuth:JwtAuthService,  private http: HttpClient,private UpdateCardService:UpdateCardService,private translateService: TranslateService
    ) { }

  ngOnInit(): void {
    this.username =this.jwtAuth.getUser()
    
    this.getBankName()
    
    this.console.log(this.data.payload.cardProcessIndicator)

    this.console.log(this.data.payload.actionType)
    this.console.log(this.data.payload)
    this.console.log(this.data.payload.customerId)
    this.buildItemForm(this.data.payload)
    this.SetOptionUpdate(this.data.payload.actionType)
    this.getCountryCodes()




   
  }

  buildItemForm(item){
    this.itemForm = this.fb.group({
      firstAccount : [item.firstAccount || '', Validators.required],
      secondAccount : [item.secondAccount || ''], 
      name : [item.name || '', Validators.required],
      address : [item.address || '', Validators.required],
      corporateName : [item.corporateName || ''],
      email : [item.email || '', Validators.required],
      renewOption : [this.initializerenewOptionControl() || '', Validators.required],
      sourcecode : [this.initializesourcecodeControl() || '', Validators.required],
      territorycode : [this.initializerterritorycodeControl() || '', Validators.required],
      birthDate : [item.birthDate || ''],
      cin : [item.cin || '', Validators.required],
      passportId : [item.passportId || ''],
      countryPhonecode : [item.countryPhonecode || '', Validators.required],
      phoneNumber : [item.phoneNumber || '', Validators.required],
      cardProcessIndicator : [ this.initializerpac() || '', Validators.required],
      updatecode :[item.updatecode], 
      postalCode:  [item.postalCode ],
      pinoffset: [item.pinoffset ],
      freesCode:  [item.freesCode ],
      statuscard:[item.freesCode ],
      binId : ['']
  
    
      
        
    });

  }

  getBankName() {
    this.jwtAuth.getBankNameByUsername(this.username).subscribe((data: any) => {
      this.bankname = data;
      console.log(this.bankname); 
      this.getbin(); 
    });
  }
  getbin() {
    if (this.bankname) {
      this.UpdateCardService.getBinsByBank(this.bankname.bankname).subscribe((databin: any) => {
        if (Array.isArray(databin) && databin.length > 0) {
          this.binId = databin[0].binId;
          console.log("binId:", this.binId);
        } else {
          console.error("No bin data available.");
        }
      });
    } else {
      console.error("Bank name is not available.");
    }
  }
  

  submit() {
    if (this.data.payload.actionType === 'updated') {
      this.generateValueSourceCode();
      this.generateValueTerritory();
      this.generateValuerenewoption();
      this.generateValueCardProcessIndicator();
  
      this.itemForm.patchValue({
        binId: this.binId,
        updatecode: 2,
        cardProcessIndicator: this.CardProcessIndicatorValues,
        sourcecode: this.Sourcecodevalue,
        territorycode: this.TerritoryCodevalue,
        statuscard: updatecode.Card_Update,
        renewOption: this.renewOptionsvalue,
      });
  
      const cardHolder = this.itemForm.value;
      console.log("Final form value:", cardHolder);
      this.dialogRef.close(cardHolder);
    } else if (this.data.payload.actionType === 'renewed') {
      this.itemForm.patchValue({
        binId: this.binId,
        updatecode: 4,
        cardProcessIndicator: "",
        sourcecode: this.Sourcecodevalue,
        statuscard: updatecode.Card_Renewal,
        territorycode: this.TerritoryCodevalue,
        renewOption: this.renewOptionsvalue,
      });
  
      const cardHolder = this.itemForm.value;
      console.log("Final form value:", cardHolder);
      this.dialogRef.close(cardHolder);
    }
  }
  submitcanacel() {
    if (this.data.payload.actionType ===  'canceled')
    this.generateValueSourceCode();
    this.generateValueTerritory();
    this.generateValuerenewoption();
    this.itemForm.patchValue({
      binId: this.binId,
      updatecode :3,
      cardProcessIndicator :"",
      sourcecode: this.Sourcecodevalue,
      statuscard : updatecode.Card_Cancellation,
      territorycode: this.TerritoryCodevalue,
      renewOption: this.renewOptionsvalue,
    });
    const cardHolder =this.itemForm.value
    this.dialogRef.close(cardHolder);
  
  }
  
  getFormDataValue(key: string): any {
    return this.formData ? this.formData[key] : null;
  }


  
  getCountryCodes(): void {
    this.http.get<Country[]>('/assets/country-codes.json').subscribe(
      (data) => {
        this.countryCodes = data;
      },
      (error) => {
        console.log('Error loading country codes:', error);
      }
    );
    }
    initializerenewOptionControl() {
      if (!this.data.Updated ) {
        return reverseRenewOption(this.data.payload.renewOption);
      } else {
        return '';
       
      }
    } 
    initializerterritorycodeControl() {
      if (!this.data.Updated) {
        return reverseTerritoryCode(this.data.payload.territorycode);
      } else {
        return '';
       
      }
    } 

    initializerpac() {
      if (!this.data.Updated) {
        return reverseCardProcessIndicator(this.data.payload.cardProcessIndicator);
      } else {
        return '';
       
      }
    } 
    initializesourcecodeControl() {
      if (!this.data.Updated) {
        return reverseSourceCode(this.data.payload.sourcecode);
      } else {
        return '';
       
      }
    } 

    
  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, control: FormControl) {
    const ctrlValue = control.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    control.setValue(ctrlValue);
    datepicker.close();
  }

  SetOptionUpdate(actiontype :string){
    actiontype = this.data.payload.actionType
    if (actiontype === 'updated') {
      this.cardProcessIndicator = Object.values(CardProcessIndicator).filter((value) => 
      value === CardProcessIndicator.Personalization_Only ||
      value === CardProcessIndicator.Pin_Mailer_Reminder ||
      value === CardProcessIndicator.Any_Other_Updated_Field
  );}

  }










generateValueCardProcessIndicator() {
  const formValue = this.itemForm.get("cardProcessIndicator").value.toString();

  if (formValue) {
   



    if (formValue === CardProcessIndicator.Pin_Mailer_Reminder.toString()) {
      this.CardProcessIndicatorValues = "C";
    }  else if (formValue === CardProcessIndicator.Personalization_Only.toString()) {
      this.CardProcessIndicatorValues = "F";
    } } else if (formValue === CardProcessIndicator.Any_Other_Updated_Field.toString()) {
      this.CardProcessIndicatorValues = '';
    }
   else {
   
  }


}
generateValueSourceCode() {
  const formValue = this.itemForm.get("sourcecode").value.toString();

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
  const formValue = this.itemForm.get("territorycode").value.toString();

  if (formValue) {


    if (formValue === TerritoryCode.International.toString()) {
      console.log("Matching: Card_First_Creation");
      this.TerritoryCodevalue = 2;
    } else if (formValue === TerritoryCode.National.toString()) {
      console.log("Matching: Card_Update");
      this.TerritoryCodevalue = 1;
    }
  } else {
    console.log("Form Value is empty or undefined");
  }

  console.log("TerritoryCode Code Values:", this.TerritoryCodevalue);
}
generateValuerenewoption() {
  const formValue = this.itemForm.get("renewOption").value.toString();

  if (formValue) {


    if (formValue === RenewOption.To_Be_Renewed_After_Expiration.toString()) {
     
      this.renewOptionsvalue = 0;
    } else if (formValue === RenewOption.Not_To_Be_Renewed.toString()) {
      
      this.renewOptionsvalue = 1;
    }
  } else {
    console.log("Form Value is empty or undefined");
  }

  console.log("renewOptionsvalue Code Values:", this.renewOptionsvalue);
}
}
