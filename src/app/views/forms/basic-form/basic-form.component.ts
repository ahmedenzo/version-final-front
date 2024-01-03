import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, ValidationErrors, AbstractControl, FormControl } from '@angular/forms';
import { RenewOption, updatecode, CardProcessIndicator,TerritoryCode ,Sourcecode,PKIiNDICATOR,ACS} from 'app/shared/models/Cardholder';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';

import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
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
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: ['./basic-form.component.css'],

  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class BasicFormComponent implements OnInit {
  currentDate: moment.Moment;
  julianDate: string;
  

  batchSequence: number = 1;


  countryCodes: Country[] = [];
  selectedCountry: string;
  phoneNumber: string;

  cardValue: string;
  countries: Country[];
  states: string[];
 

  formData = {};
  showPopup = false;
  date1: UntypedFormControl;
  date2: UntypedFormControl;
  basicForm: UntypedFormGroup;
  console = console;
  renewOptions: string[];
  renewOptionsvalue: number ;
  updatecode: any[] 
  TerritoryCode: any[] ;
  TerritoryCodevalue: number ;
  updateCodeValues: number ;
  CardProcessIndicatorValues: any ;
  CardProcessIndicator: string[];
  CardholderNumber: any;
  CustomerId: any;

  Sourcecode: any[] 
  Sourcecodevalue: number ;
  PKIiNDICATOR: any[]
  PKIiNDICATORvalue: number ;
  ACS: any[]
  ACSCodevalue: string ;

  OperatorUserCode: any;
  FreesCode: any;

  PkiMembership: any;
  SecondAccount: any;
  AcsMembership: any;
  Pinoffset: any;
  BankIdCode:any;

  ProcessJulianDate:any
   BirthDate: any

  
 

  
  // Usage

  
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getCountryCodes();
    this.currentDate = moment();
    this.julianDate = this.calculateJulianDate(this.currentDate);
    this.date1 = new UntypedFormControl(moment(), [Validators.required]);
    this.date2 = new UntypedFormControl(moment(), [Validators.required]);
    this.TerritoryCode= Object.values(TerritoryCode);
    
    this.renewOptions = Object.values(RenewOption);
    this.updatecode = Object.values(updatecode); 

    this.Sourcecode = Object.values(Sourcecode); 
    this.PKIiNDICATOR = Object.values(PKIiNDICATOR); 
    this.ACS = Object.values(ACS); 


 
    
    this.CardProcessIndicator = Object.values(CardProcessIndicator);
    this.basicForm = new UntypedFormGroup({
      birthdayControl : new UntypedFormControl(''),
      updatecode: new UntypedFormControl('', [Validators.required]),
      phoneNumber: new UntypedFormControl('', [Validators.required]),
      countrycodess: new UntypedFormControl('', [Validators.required]),
      Sourcecode: new UntypedFormControl('', [Validators.required]),
      PKIiNDICATOR: new UntypedFormControl('', [Validators.required]),
      ACS: new UntypedFormControl('', [Validators.required]),
      Card: new UntypedFormControl(['Platinum']),
      CardType: new UntypedFormControl(''),
      countryCode: new UntypedFormControl('788'),
      cityCode: new UntypedFormControl(''),
      countryCodenumber: new UntypedFormControl(''),
      
      
      
      TerritoryCode: new UntypedFormControl(''),
     
      CustomerId: new UntypedFormControl(''),
      BankIdCode: new UntypedFormControl('00151'),
      Pinoffset: new UntypedFormControl(''),
      OperatorUserCode: new UntypedFormControl(''),
      FreesCode: new UntypedFormControl(''),
      

      PkiMembership: new UntypedFormControl(''),
      SecondAccount: new UntypedFormControl(''),
      AcsMembership: new UntypedFormControl(''),
      CardholderNumber: new UntypedFormControl('PO00'),

      FirstAccount: new UntypedFormControl('', [
        Validators.minLength(24),
        Validators.maxLength(24),
        Validators.pattern('^[0-9]+$'),
      ]),
      Branchcode: new UntypedFormControl('', [
        Validators.minLength(5),
        Validators.maxLength(5),
        Validators.pattern('^[0-9]+$'),
      ]),
      Address: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9 ]*'),
        nameValidator,
      ]),
      Addresstwo: new UntypedFormControl('', [
        Validators.pattern('[a-zA-Z0-9 ]*'),
        nameValidator,
      ]),
      Addressthree: new UntypedFormControl('', [
        Validators.pattern('[a-zA-Z0-9 ]*'),
        nameValidator,
      ]),
      date1: this.date1,
      date2: this.date2,

      CorporateName: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z ]*'),
        nameValidator,
      ]),
      currencycode: new UntypedFormControl('434', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
        Validators.minLength(3),
        Validators.maxLength(3),
      ]),
      Name: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z ]*'),
        nameValidator,
      ]),
      PostalCode: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
      ]),
      RenewOption: new UntypedFormControl('', [Validators.required]),
      CardProcessIndicator: new UntypedFormControl('', [Validators.required]),

      
      CIN: new UntypedFormControl('', [
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.required,
      ]),
      passportId: new UntypedFormControl('', [
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(10),
        Validators.maxLength(32),
      ]),
      usePassport: new UntypedFormControl(false),

     
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
    });
    this.updateCardValue();
    
    const birthday = this.basicForm.value.birthdayControl;
    const formattedBirthday = birthday.split('-').join('');

    
   /* this.basicForm.get("country").valueChanges.subscribe((country) => {
      this.basicForm.get("city").reset();
      if (country) {
        this.states = this.BasicService.getStatesByCountry(country);
        this.countryCode = this.getCountryCode(country);
      }
    });*/
  }

 /* getCountryCode(country: string): string {
    const selectedCountry = this.countries.find((c: { shortName: string }) => c.shortName === country);
    return selectedCountry ? selectedCountry.phone : '';
  }*/
  
  





  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, control: FormControl) {
    const ctrlValue = control.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    control.setValue(ctrlValue);
    datepicker.close();
  }

  generateFormattedData(formData): string {
    const fields = [
      { key: 'CardholderNumber', size: 23, spaceLength: 0 },
      { key: 'updateCodeValues', size: 1, spaceLength: 0 },
      { key: 'CardType', size: 2, spaceLength: 0 },
      { key: 'Name', size: 26, spaceLength: 26 },
      { key: 'CorporateName', size: 26, spaceLength: 0 },
      { key: 'Address', size: 32, spaceLength: 0 },
      { key: 'Addresstwo', size: 32, spaceLength: 0 },
      { key: 'Addressthree', size: 32, spaceLength: 0 },
      { key: 'PostalCode', size: 9, spaceLength: 26 },
      { key: 'FirstAccount', size: 24, spaceLength: 0 },
      { key: 'SecondAccount', size: 24, spaceLength: 0 },
      { key: 'Branchcode', size: 5, spaceLength: 0 },
      { key: 'date1', size: 4, spaceLength: 0 },
      { key: 'date2', size: 4, spaceLength: 0 },
      { key: 'CardProcessIndicator', size: 1, spaceLength: 29 },
      { key: 'Pinoffset', size: 12, spaceLength: 0 },
      { key: 'FreesCode', size: 3, spaceLength: 0 },
      { key: 'TerritoryCodevalue', size: 1, spaceLength: 8},
      { key: 'julianDate', size: 6, spaceLength: 0},
      { key: 'BankIdCode', size: 5, spaceLength: 8 },
      { key: 'passportId', size: 10, spaceLength: 6 },
      { key: 'countryCode', size: 10, spaceLength: 6 },
      { key: 'cityCode', size: 5, spaceLength: 0 },
      { key: 'renewOptionsvalue', size: 1, spaceLength: 26 },
      { key: 'Sourcecodevalue', size: 1, spaceLength: 25},
      { key: 'currencycode', size: 3, spaceLength: 0},
      { key: 'OperatorUserCode', size: 6, spaceLength: 0},
      { key: 'CustomerId', size: 24, spaceLength: 6},
      { key: 'PKIiNDICATORvalue', size: 1, spaceLength: 0 },
      { key: 'ACSCodevalue', size: 1, spaceLength: 0 },
      { key: 'CIN', size: 16, spaceLength: 29 },
      { key: 'countrycodess', size: 3, spaceLength: 0 },
      { key: 'phoneNumber', size: 11, spaceLength: 0 },
      { key: 'birthdayControl', size: 8, spaceLength: 0 },
      
      
      
     
      
    ];
  
    let formattedText = '';
  
    for (const field of fields) {
      let fieldValue = '';
  
      if (field.key === 'date1') {
        fieldValue = this.date1.value.format('MMYY');
      } else if (field.key === 'date2') {
        fieldValue = this.date2.value.format('MMYY');
      } else if (field.key === 'updateCodeValues') {
        fieldValue = this.updateCodeValues.toString();
      } else if (field.key === 'TerritoryCodevalue') {
        fieldValue = this.TerritoryCodevalue.toString();
      }else if (field.key === 'CardProcessIndicator') {
        fieldValue = this.CardProcessIndicatorValues.toString();
      } else if (field.key === 'renewOptionsvalue') {
        fieldValue = this.renewOptionsvalue.toString();
      }
      else if (field.key === 'PKIiNDICATORvalue') {
        fieldValue = this.PKIiNDICATORvalue.toString();
      }
      else if (field.key === 'Sourcecodevalue') {
        fieldValue = this.Sourcecodevalue.toString();
      }
      else if (field.key === 'ACSCodevalue') {
        fieldValue = this.ACSCodevalue.toString();
      }else {
        fieldValue = formData[field.key] ? formData[field.key].substring(0, field.size) : '';
      }
  
      const paddedValue = fieldValue.padEnd(field.size);
      formattedText += paddedValue;
  
      const spaceLength = field.spaceLength || 0;
      const spaces = ' '.repeat(spaceLength);
      formattedText += spaces;
    }
  
    return formattedText;
  }
  updateCardValue(): void {
    const cardValue = this.basicForm.value.Card;
    if (cardValue === 'Platinum') {
      this.cardValue = '33';
    } else if (cardValue === 'Elite') {
      this.cardValue = '82';
    } else {
      this.cardValue = '';
    }
    
    this.basicForm.patchValue({
      CardType: this.cardValue
    });
  }


  
  generateValueCardProcessIndicator() {
    const formValue = this.basicForm.get("CardProcessIndicator").value.toString();
  
    if (formValue) {
      console.log("Form Value:", formValue);
  
      console.log("Enum Values:", CardProcessIndicator);
      if (formValue === CardProcessIndicator.Pin_Mailer_Reminder.toString()) {
        this.CardProcessIndicatorValues = "C";
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
      console.log("Form Value is empty or undefined");
    }
  
    console.log("CardProcessIndicatorValues Values:", this.CardProcessIndicatorValues);
  }


  generateValueAcs() {
    const formValue = this.basicForm.get("ACS").value.toString();
  
    if (formValue) {
      console.log("Form Value:", formValue);
  
      console.log("Enum Values:", ACS);
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
      console.log("Form Value is empty or undefined");
    }
  
    console.log("CardProcessIndicatorValues Values:", this.CardProcessIndicatorValues);
  }


  
  generateValue() {
    const formValue = this.basicForm.get("updatecode").value.toString();
  
    if (formValue) {
      console.log("Form Value:", formValue);
  
      console.log("Enum Values:", updatecode);
  
      if (formValue === updatecode.Card_First_Creation.toString()) {
        console.log("Matching: Card_First_Creation");
        this.updateCodeValues = 1;
      } else if (formValue === updatecode.Card_Update.toString()) {
        console.log("Matching: Card_Update");
        this.updateCodeValues = 2;
      } else if (formValue === updatecode.Card_Cancellation.toString()) {
        console.log("Matching: Card_Cancellation");
        this.updateCodeValues = 3;
      } else if (formValue === updatecode.Card_Renewal.toString()) {
        console.log("Matching: Card_Renewal");
        this.updateCodeValues = 4;
      }
    } else {
      console.log("Form Value is empty or undefined");
    }
  
    console.log("Updated Code Values:", this.updateCodeValues);
  }
  
  generateValueSourceCode() {
    const formValue = this.basicForm.get("Sourcecode").value.toString();
  
    if (formValue) {
      console.log("Form Value:", formValue);
  
      console.log("Enum Values:", Sourcecode);
  
      if (formValue === Sourcecode.Individual.toString()) {
        
        this.Sourcecodevalue = 1;
      } else if (formValue === Sourcecode.BankStaff.toString()) {
        
        this.Sourcecodevalue = 2;
      } else if (formValue === Sourcecode.Corporate.toString()) {
      
        this.Sourcecodevalue = 3;
      } 
    } else {
      console.log("Form Value is empty or undefined");
    }
  
    
  }

  generateValuePKi() {
    const formValue = this.basicForm.get("PKIiNDICATOR").value.toString();
  
    if (formValue) {
      console.log("Form Value:", formValue);
  
      console.log("Enum Values:", PKIiNDICATOR);
  
      if (formValue === PKIiNDICATOR.PKI_CARD.toString()) {
        
        this.PKIiNDICATORvalue = 0;
      } else if (formValue === PKIiNDICATOR.NOT_PKI_CARD.toString()) {
        
        this.PKIiNDICATORvalue = 1;
      } 
    } else {
      console.log("Form Value is empty or undefined");
    }
  
    
  }

  generateValueTerritory() {
    const formValue = this.basicForm.get("TerritoryCode").value.toString();
  
    if (formValue) {
      console.log("Form Value:", formValue);
  
      console.log("Enum Values:", TerritoryCode);
  
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
    const formValue = this.basicForm.get("RenewOption").value.toString();
  
    if (formValue) {
      console.log("Form Value:", formValue);
  
      console.log("Enum Values:", RenewOption);
  
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
  submit() {
    if (this.basicForm.valid) {
      console.log('Form submitted successfully!');
      console.log('Form Data:', this.basicForm.value);
      console.log('countrycode:', this.basicForm.value);
      this.generateValue();
      this.generateValueCardProcessIndicator();
      this.generateValueTerritory();
      this.generateValuerenewoption();
      this.updateCardValue();
      this.generateValuePKi();
      this.generateValueAcs();
      this.generateValueSourceCode();
      const formData = {
        CardholderNumber: this.basicForm.value.CardholderNumber,
        FreesCode: this.basicForm.value.FreesCode,
        CardType: this.basicForm.value.CardType,
        Name: this.basicForm.value.Name,
        CorporateName: this.basicForm.value.CorporateName,
        Address: this.basicForm.value.Address,
        Addresstwo: this.basicForm.value.Addresstwo,
        Addressthree: this.basicForm.value.Addressthree,
        PostalCode: this.basicForm.value.PostalCode,
        Branchcode: this.basicForm.value.Branchcode,
        SecondAccount: this.basicForm.value.SecondAccount,
        FirstAccount:  this.basicForm.value.FirstAccount,
        Pinoffset:  this.basicForm.value.Pinoffset,
        OperatorUserCode : this.basicForm.value.OperatorUserCode,
        BankIdCode:  this.basicForm.value.BankIdCode,

        julianDate:  this.julianDate,
        passportId:  this.basicForm.value.passportId,
        countryCode:  this.basicForm.value.countryCode,
        cityCode:  this.basicForm.value.cityCode,
        CIN:  this.basicForm.value.CIN,
        countryCodenumber:  this.basicForm.value.countryCodenumber,
        phoneNumber:  this.basicForm.value.phoneNumber,
        countrycodess:  this.basicForm.value.countrycodess,
        birthdayControl:  this.basicForm.value.birthdayControl,
        


      };
  
      this.generateTextFile(formData);
    } else {
      console.log('Form validation failed!');
      this.basicForm.markAllAsTouched();
    }
  }
  
  generateTextFile(formData) {
    const formattedData = this.generateFormattedData(formData);
    const filename = 'form_data.txt';
    const blob = new Blob([formattedData], { type: 'text/plain' });
  
    const anchorElement = document.createElement('a');
    const url = URL.createObjectURL(blob);
  
    anchorElement.href = url;
    anchorElement.download = filename;
    anchorElement.click();
  
    setTimeout(() => {
      URL.revokeObjectURL(url);
      anchorElement.remove();
    }, 0);
  }
 /*onCountryChange(countryShotName: string) {
    this.states = this.BasicService.getStatesByCountry(countryShotName);
  }*/


  calculateJulianDate(date: moment.Moment): string {
    const year = date.format('YY');
    const dayOfYear = date.format('DDD');
    const julianDate = `${year}${dayOfYear}${this.batchSequence}`;
    return julianDate;
  }
  
  getCountryCodes(): void {
    this.http.get<Country[]>('/assets/country-codes.json').subscribe(
      (data) => {
        this.countryCodes = data;
        console.log(this.countryCodes);
      },
      (error) => {
        console.log('Error loading country codes:', error);
      }
    );
  }
}