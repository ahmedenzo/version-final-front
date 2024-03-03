import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopupUpdateComponent } from 'app/views/update-card/update-table/popup-update/popup-update/popup-update.component';

@Component({
  selector: 'app-pbfpopup',
  templateUrl: './pbfpopup.component.html',
  styleUrls: ['./pbfpopup.component.scss']
})
export class PbfpopupComponent implements OnInit {
  public itemForm: FormGroup;
  public isInputDisabled: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PbfpopupComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item): void {
    const availBalDisplay = item.availBal / 100;
    const ledgBalDisplay = item.ledgBal / 100;
    this.itemForm = this.fb.group({
      availBal: [availBalDisplay || '', [Validators.required, Validators.pattern('^[0-9]+$')]],
      ledgBal: [ledgBalDisplay || '', [Validators.required, Validators.pattern('^[0-9]+$')]],
      numAccount: [{ value: item.numAccount || '', disabled: this.isInputDisabled }, [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }

  submit(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { availBal: this.itemForm.value.availBal, ledgBal: this.itemForm.value.ledgBal }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const formValues = this.itemForm.value;
        formValues.availBal *= 100;
        formValues.ledgBal *= 100;

        // Use the original numAccount value from the data payload
        formValues.numAccount = this.data.payload.numAccount;

        this.dialogRef.close(formValues);
      }
    });
  }
}
@Component({
  selector: 'confirmation-dialog',
  template: `
  <h1 mat-dialog-title class="warning-title">Confirmation</h1>
  <div mat-dialog-content class="warning-message">
    Are you sure you want to proceed:<br>
    <span class="blue-text">Avail Bal:</span> <span class="dollar-sign">$</span><span class="value">{{ data.availBal }}</span><br>
    <span class="blue-text">Ledg Bal:</span> <span class="dollar-sign">$</span><span class="value">{{ data.ledgBal }}</span><br>
  </div>
  <div mat-dialog-actions class="dialog-buttons">
    <button mat-button class="no-button" (click)="onNoClick()">No</button>
    <button mat-button class="yes-button" (click)="onYesClick()" cdkFocusInitial>Yes</button>
  </div>
  `,
  styles: [`
    .mat-dialog-container {
      width: 400px; /* Set the width to your desired value */
    }

    .warning-title {
      color: #ff9800; /* Orange color */
      font-size: 24px; /* Larger font size */
    }

    .value {
      color: #008000; /* Green color */
    }

    .blue-text {
      color: #0000FF; /* Blue color */
    }

    .dollar-sign {
      color: #008000; /* Green color */
    }
    
    .warning-message {
      color: #ff5722; /* Deep orange color */
      font-size: 20px; /* Font size adjusted */
      font-weight: bold;
    }

    .dialog-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 20px; /* Adjusted margin between the buttons and the message */
    }

    .no-button {
      margin-right: 20px; /* Adjusted margin between the buttons */
    }

    .yes-button {
      background-color: #ff9800; /* Orange color */
      color: white;
    }
  `]
})
export class ConfirmationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ConfirmationDialogComponent>) { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}