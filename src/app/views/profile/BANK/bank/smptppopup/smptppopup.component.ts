import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-smptppopup',
  templateUrl: './smptppopup.component.html',
  styleUrls: ['./smptppopup.component.scss']
})
export class SmptppopupComponent implements OnInit {
  public itemForm: UntypedFormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SmptppopupComponent>,
    private fb: UntypedFormBuilder,
  ) { }
  ngOnInit() {
    console.log('Payload data:', this.data.payload);
    if (this.data && this.data.payload) {
      this.buildItemForm(this.data.payload);
    } else {
      console.error("No payload data received.");
    }
  }
  
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      host: [item.host || '', Validators.required],
      port: [item.port || ''],
      username: [item.username || ''],
      password: [item.password || ''],
      id: [item.id ],
    });
  }
  

  submit() {
    this.dialogRef.close(this.itemForm.value)
    console.log(this.itemForm.value)
  }
}
