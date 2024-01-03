import { Component, OnInit } from '@angular/core';
import { GeneratedfileService } from '../../generatedfile.service';
import { DatePipe } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'] ,
  providers: [DatePipe]
})
export class HistoryComponent implements OnInit {
  uploadedData: any[] = [];
  displayedColumns: string[] = ['uploadedAt', 'fileName'];
  filteredData: any[] = []; 

  constructor(private GeneratedfileService: GeneratedfileService,private datePipe: DatePipe,public dialogRef: MatDialogRef<HistoryComponent>) { }

  ngOnInit(): void {
    this.GeneratedfileService.getAllUploadedDataCardHolders().subscribe(data => {
      this.uploadedData = data.reverse(); // Reverse the data to make the newest data appear first
      this.filteredData = [...this.uploadedData];
    });
  }
  

  applyFilter(type: string, value: any) {
    if (type === 'date') {
      value = this.datePipe.transform(value, 'yyyy-MM-dd'); 
      this.filteredData = this.uploadedData.filter(data =>
        data.uploadedAt && data.uploadedAt.indexOf(value) !== -1);
    } else if (type === 'file') {
      this.filteredData = this.uploadedData.filter(data =>
        data.fileName && data.fileName.toLowerCase().includes(value.toLowerCase())); 
    }
  }
  cancel(): void {
    this.dialogRef.close();
  }
  
  
}
