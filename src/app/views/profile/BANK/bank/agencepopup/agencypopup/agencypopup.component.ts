import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-agencypopup',
  templateUrl: './agencypopup.component.html',
  styleUrls: ['./agencypopup.component.scss']
})
export class AgencypopupComponent implements OnInit {

  public itemForm: UntypedFormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AgencypopupComponent>,
    private fb: UntypedFormBuilder,
  ) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload)
  }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      agenceName: [item.agenceName || '', Validators.required],
      agenceAdresse: [item.agenceAdresse || ''],
      contactEmail: [item.contactEmail || ''],
      contactPhone: [item.contactPhone || ''],
      branchCode: [item.branchCode || ''],
      cityCode: [item.cityCode || ''],
      openingDate: [item.openingDate || ''],
      
      
    

    })
  }

  submit() {
    this.dialogRef.close(this.itemForm.value)
    console.log(this.itemForm.value)
  }
}
