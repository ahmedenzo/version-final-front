import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ListefileService } from '../listefile.service';

interface File {
  bankName: string;
  fileName: string;
  generatedBy: string;
  createdAt: Date;
}

@Component({
  selector: 'app-listefile',
  templateUrl: './listefile.component.html',
  styleUrls: ['./listefile.component.scss']
})
export class ListefileComponent implements OnInit {

  @ViewChild('portPaginator') portPaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public cafFiles: any[] = [];
  public pbfFiles: any[] = [];
  public portFiles: any[] = [];

  public displayedColumns: string[] = ['bankName', 'fileName', 'generatedBy', 'createdAt', 'Send', 'actions'];
  public getItemSub: Subscription;
  public dataSource: MatTableDataSource<any>;
  public fileInformationIds: number[] = [];

  constructor(
    private snack: MatSnackBar,
    private crudService: ListefileService,
  ) { }

  ngOnInit() {
    this.getItems();
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  getStatusColor(row: any): any {
    return row.sent ? { 'background-color': 'lightgreen' } : { 'background-color': '#ffffcc' };
  }

  getItems() {
    this.getItemSub = this.crudService.getItems().subscribe(data => {
      this.cafFiles = [];
      this.pbfFiles = [];
      this.portFiles = [];

      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      data.forEach(file => {
        if (file.fileName.includes('CAF')) {
          this.cafFiles.push(file);
        } else if (file.fileName.includes('PBF')) {
          this.pbfFiles.push(file);
        } else if (file.fileName.includes('PORT')) {
          this.portFiles.push(file);
        }
        file.sent = file.sent ? 1 : 0;
      });

      this.dataSource = new MatTableDataSource(data);
      this.fileInformationIds = data.map(item => item.fileId);
      this.dataSource.sort = this.sort;
    });
  }

  uploadFiles(fileId: number) {
    this.crudService.uploadFiles(fileId).subscribe(
      response => {
        const fileToUpdate = this.dataSource.data.find((file: any) => file.fileId === fileId);
        if (fileToUpdate) {
          fileToUpdate.sent = 1;
          this.dataSource.data = [...this.dataSource.data];
        }

        this.snack.open('File uploaded successfully', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        console.log('File uploaded successfully:', response);
      },
      error => {
        this.snack.open('Error uploading file. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
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
        console.error('Error downloading file', error);
      });
  }

}
