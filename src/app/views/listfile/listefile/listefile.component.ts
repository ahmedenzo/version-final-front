import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { CrudService } from 'app/views/cruds/crud.service';
import { Subscription } from 'rxjs';
import { ListefileService } from '../listefile.service';

@Component({
  selector: 'app-listefile',
  templateUrl: './listefile.component.html',
  styleUrls: ['./listefile.component.scss']
})
export class ListefileComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  public dataSource: any;
  public displayedColumns: any;
  public getItemSub: Subscription;
  public fileInformationIds: number[] = [];
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private crudService: ListefileService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) { }

  ngOnInit() {
    this.displayedColumns = this.getDisplayedColumns();
    this.getItems()
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }
  }

  getDisplayedColumns() {
    return ['bankName', 'fileName', 'generatedBy', 'createdAt', 'actions'];
  }


  getItems() {
    this.getItemSub = this.crudService.getItems().subscribe(data => {
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      this.dataSource = new MatTableDataSource(data);
      
      // Populate fileInformationIds with IDs from the retrieved items
      this.fileInformationIds = data.map(item => item.fileId);
    });
  }

  uploadFiles(fileId: number) {
    this.crudService.uploadFiles(fileId).subscribe(
      response => {
        // Handle success, show a snackbar message
        this.snack.open('File uploaded successfully', 'Close', {
          duration: 3000, // Duration for which the snackbar will be displayed (in milliseconds)
          panelClass: ['snackbar-success'] // CSS class for styling the snackbar (optional)
        });
        console.log('File uploaded successfully:', response);
      },
      error => {
        // Handle error, show a snackbar message
        this.snack.open('Error uploading file. Please try again.', 'Close', {
          duration: 3000, // Duration for which the snackbar will be displayed (in milliseconds)
          panelClass: ['snackbar-error'] // CSS class for styling the snackbar (optional)
        });
        console.error('Error uploading file:', error);
      }
    );
  }


  download(filename: string) {
    this.crudService.downloadFile(filename)
      .subscribe(response => {
        const blob = new Blob([response.body], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, error => {
        // Handle error, show a message, etc.
        console.error('Error downloading file', error);
      });
  }

  
}