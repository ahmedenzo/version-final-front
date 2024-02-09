import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopupUpdateComponent } from 'app/views/update-card/update-table/popup-update/popup-update/popup-update.component';

@Component({
  selector: 'app-pbfpopup',
  templateUrl: './pbfpopup.component.html',
  styleUrls: ['./pbfpopup.component.scss']
})
export class PbfpopupComponent implements OnInit {
  public itemForm: FormGroup;
  public isInputDisabled: boolean = true;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<PbfpopupComponent>,
  private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.buildItemForm(this.data.payload)
  }

  buildItemForm(item){
    const availBalDisplay = item.availBal / 100;
    const ledgBalDisplay = item.ledgBal / 100;
    this.itemForm = this.fb.group({
      availBal : [availBalDisplay || '',[Validators.required, Validators.pattern('^[0-9]+$')]],
      ledgBal : [ledgBalDisplay|| '',[Validators.required, Validators.pattern('^[0-9]+$')]], 
      numAccount: [{ value: item.numAccount || '', disabled: this.isInputDisabled }, [Validators.required, Validators.pattern('^[0-9]+$')]],   
    });

  }
  submit(): void {
    const formValues = this.itemForm.value;
    formValues.availBal *= 100;
    formValues.ledgBal *= 100;

    // Use the original numAccount value from the data payload
    formValues.numAccount = this.data.payload.numAccount;

    this.dialogRef.close(formValues);
  }
  
}
