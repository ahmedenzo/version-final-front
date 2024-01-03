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
  isInputEnabled = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<PbfpopupComponent>,
  private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.buildItemForm(this.data.payload)
  }

  buildItemForm(item){
    this.itemForm = this.fb.group({
      availBal : [item.availBal || '',[Validators.required, Validators.pattern('^[0-9]+$')]],
      ledgBal : [item.ledgBal || '',[Validators.required, Validators.pattern('^[0-9]+$')]], 
      numAccount : [item.numAccount || '',[Validators.required, Validators.pattern('^[0-9]+$')] ],   
    });

  }

  submit() {
    
    this.dialogRef.close(this.itemForm.value)


  }
}
