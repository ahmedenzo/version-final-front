import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TerritoryCode } from 'app/shared/models/Cardholder';
import { reverseTerritoryCode } from 'app/views/cruds/FormHelper';
@Component({
  selector: 'app-binpopup',
  templateUrl: './binpopup.component.html',
  styleUrls: ['./binpopup.component.scss']
})
export class BinpopupComponent implements OnInit {
  numbersArray: number[] = Array.from({length: 10}, (_, i) => i + 1)
  territorycode: any[] ;
  TerritoryCodevalue: number ;

  public itemForm: UntypedFormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BinpopupComponent>,
    private fb: UntypedFormBuilder,

  ) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload)
    this.territorycode= Object.values(TerritoryCode);
  }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      binValue: [item.binValue || '', Validators.required],
      expireRange: [item.expireRange || ''],
      moneyCode: [item.moneyCode || ''],
      cardBrand: [item.cardBrand || ''],
      cardType: [item.cardType || ''],
      currency: [item.currency || ''],
      codeType: [item.codeType || ''],
      territorycode: [this.initializerterritorycodeControl()|| ''],
      
    

    })
  }

  submit() {
    this.generateValueTerritory();
    this.itemForm.patchValue({
      territorycode: this.TerritoryCodevalue,
    });
    const bin = this.itemForm.value;
     
   
      

      
  
    this.dialogRef.close(bin);
  
    console.log(this.itemForm.value)
  }
  initializerterritorycodeControl() {
    if (!this.data.isNew && !this.data.isAddMode) {
      return reverseTerritoryCode(this.data.payload.territorycode);
    } else {
      return '';
     
    }
  } 
  generateValueTerritory() {
    const formValue = this.itemForm.get("territorycode").value.toString();
  
    if (formValue) {

  
      if (formValue === TerritoryCode.International.toString()) {
      
        this.TerritoryCodevalue = 2;
      } else if (formValue === TerritoryCode.National.toString()) {
      
        this.TerritoryCodevalue = 1;
      }
    } else {

    }
  
    console.log("TerritoryCode Code Values:", this.TerritoryCodevalue);
  }
}


