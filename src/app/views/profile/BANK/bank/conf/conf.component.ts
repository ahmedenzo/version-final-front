import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-conf',
  templateUrl: './conf.component.html',
  styleUrls: ['./conf.component.scss']
})
export class ConfComponent implements OnInit {

  public itemForm: UntypedFormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfComponent>,
    private fb: UntypedFormBuilder,
  ) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload)
  }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      server: [item.server || '', Validators.required],
      port: [item.port || ''],
      password: [item.password || ''],
      username: [item.username || ''],
      remotePath: [item.remotePath || ''],
      id: [item.id ],

      
      
    

    })
  }

  submit() {
    this.dialogRef.close(this.itemForm.value)
    console.log(this.itemForm.value)
  }
}
