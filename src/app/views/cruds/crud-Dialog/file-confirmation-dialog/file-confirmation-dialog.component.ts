import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-file-confirmation-dialog',
  templateUrl: './file-confirmation-dialog.component.html',

})
export class FileConfirmationDialogComponent {
  title: string;
  text: string;

  constructor(
    public dialogRef: MatDialogRef<FileConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title;
    this.text = data.text;
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

  onCancelClick(): void {
    this.dialogRef.close(false);
  }
}
