import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { Service } from 'app/views/profile/profile.service';

@Component({
  selector: 'app-bankpopup',
  templateUrl: './bankpopup.component.html',
  styleUrls: ['./bankpopup.component.scss']
})
export class BankpopupComponent implements OnInit {
  public itemForm: FormGroup;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<BankpopupComponent>,
  private fb: FormBuilder,
  public jwtAuth: JwtAuthService, ) { }

  ngOnInit(): void {
    this.buildItemForm(this.data.payload)
  }

  buildItemForm(item){
    this.itemForm = this.fb.group({
      bankName : [item.bankName || '', Validators.required],
      bankIdCode : [item.bankIdCode || '', Validators.required], 
      bankLocation : [item.bankLocation || '', Validators.required],
      contactEmail : [item.contactEmail || '', Validators.required],
      contactPhone : [item.contactPhone || '', Validators.required ,],
      mainOfficeAddress: [item.mainOfficeAddress ||'', Validators.required, ],
      countryCode: [item.countryCode ||'', Validators.required, ],
     
  
      
    });

  }

  submit() {
    
    this.dialogRef.close(this.itemForm.value)


  }
}


