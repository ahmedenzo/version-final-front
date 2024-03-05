import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { GeneratedfileService } from '../../generatedfile.service';
import { MatDialog } from '@angular/material/dialog';
import { HistoryComponent } from '../../history/history/history.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-ftpupload',
  templateUrl: './ftpupload.component.html',
  styleUrls: ['./ftpupload.component.scss']
})
export class FtpuploadComponent  {
  @Output() fileUploaded: EventEmitter<any> = new EventEmitter<any>();
  uploadForm: FormGroup;
  uploadSuccess: boolean = false;
  uploadError: boolean = false;
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private crudService: GeneratedfileService,
    private translate: TranslateService
  ) {
    this.uploadForm = new FormGroup({
      file: new FormControl(),
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    this.uploadForm.get('file')?.setValue(files);
  }
  
  onSubmit() {
    const formData = new FormData();
    const files: FileList = this.uploadForm.get('file').value;

    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }

    this.loader.open(this.translate.instant('SENDING')); // Translate the message
    this.crudService.uploadFile(formData).subscribe(
      (response: any) => {
        console.log(this.translate.instant('SUCCESS'), response); // Translate the message
        this.uploadSuccess = true;
        this.uploadError = false;
        this.snackBar.open(this.translate.instant('FILE_UPLOADED_SUCCESSFULLY'), 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
        
        this.loader.close();
      },
      (error: any) => {
        console.error(this.translate.instant('ERROR_UPLOADING_FILE'), error); // Translate the message

        this.uploadError = true;
        this.uploadSuccess = false;

        if (typeof error === 'string') {
          this.snackBar.open(this.translate.instant('CLIENT_SIDE_ERROR', { error }), 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar'
          });
        } else if (error.status === 401) {
          this.snackBar.open(this.translate.instant('FAILED_TO_CONNECT_FTP', { error }), 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar'
          });
        } else if (error.status === 500) {
          this.snackBar.open(this.translate.instant('FAILED_TO_UPLOAD', { error }), 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar'
          });
        } else {
          this.snackBar.open(this.translate.instant('SERVER_SIDE_ERROR', { error }), 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar'
          });
        }

        this.loader.close();
      }
    );
  }
  
  viewHistory(): void {
    const dialogRef = this.dialog.open(HistoryComponent);

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
  

}


