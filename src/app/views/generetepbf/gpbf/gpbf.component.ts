import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { GpbfService } from '../gpbf.service';
import { groupBy } from 'lodash';
@Component({
  selector: 'app-gpbf',
  templateUrl: './gpbf.component.html',
  styleUrls: ['./gpbf.component.scss']
})
export class GpbfComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  openedPanels: number[] = [];
  public dataSource: any;
  public groupedDataKeys: string[];
  public groupedData: { [date: string]: any[] } = {};
  public displayedColumns: any;
  public getItemSub: Subscription;
  public panelsWithGeneratedFiles: number[] = [];

  constructor( private loader: AppLoaderService,
    private snack: MatSnackBar,
   private GpbfService:GpbfService,
    private translate: TranslateService) { }

  ngOnInit(): void {

    this.panelsWithGeneratedFiles = JSON.parse(localStorage.getItem('generatedPanels') || '[]');
    // ... rest of the code
    const generatedPanels = JSON.parse(localStorage.getItem('generatedPanels') || '[]');
    this.panelsWithGeneratedFiles = generatedPanels;
    this.displayedColumns = this.getDisplayedColumns();
    this.getItemSub = this.GpbfService.getnotgenerated()
    .subscribe(data => {
      console.log('Service data:', data);
    

      this.groupedData = groupBy(data, item => {
        if (item.updatedAt && new Date(item.updatedAt).getTime() > new Date(item.createdAt).getTime()) {
          return this.formatDate(item.updatedAt);
        }
        return this.formatDate(item.createdAt);
      });
    
      console.log('Grouped Data:', this.groupedData);
    
      
      this.groupedDataKeys = Object.keys(this.groupedData).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB.getTime() - dateA.getTime();
      });
    
      this.dataSource = new MatTableDataSource(data);  
    });
    this.fetchData(); // Call the method to fetch data
  }
  getPanelColor(dateKey: string): string {
    const panelIndex = this.groupedDataKeys.indexOf(dateKey);
    if (this.panelsWithGeneratedFiles.includes(panelIndex)) {
      return '#90EE90';  // Green color
    }
  
    const dataSet = this.groupedData[dateKey];
    const anyCardNotGenerated = dataSet.some(row => Number(row.pbfgenerated) === 0);
    return anyCardNotGenerated ? '#FFF9A6' : '#90EE90';
  }
  



  
  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
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
    return ['name','cardholderNumber','Account', 'Valid','available_balance','ledgBal' ];
  }

  panelOpened(panelNumber: number): void {
    if (!this.openedPanels.includes(panelNumber)) {
        this.openedPanels.push(panelNumber);
    }
    console.log("Panel Opened with data:", this.groupedData[this.groupedDataKeys[panelNumber]]);
}



  panelClosed(panelNumber: number): void {
    const index = this.openedPanels.indexOf(panelNumber);
    if (index !== -1) {
      this.openedPanels.splice(index, 1);
    }
  }

  isPanelOpen(panelNumber: number): boolean {
    return this.openedPanels.includes(panelNumber);
  }
  generateFileForData(dateKey: string): void {
    this.fetchData(); // Fetch data if needed
  
    const dataSet = this.groupedData[dateKey];
    console.log('Data for generation:', dataSet);
  
    // Extract customerIds from dataSet
    const customerIds = dataSet.map(item => item.id);
  
    const loaderMessage = this.translate.instant('Generating Cards');
    this.loader.open(loaderMessage);
  
    this.GpbfService.generatepbfFile(customerIds).subscribe(
      (data: HttpResponse<string>) => {
        console.log('Generated Data:', data.body); // Access the response body, which contains the plain text data
        const snackMessage = this.translate.instant('File generated and saved successfully!', 'success');
        this.snack.open(snackMessage, 'OK', { duration: 4000 });
        this.loader.close();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      (error) => {
        console.error(error);
        // Handle error if necessary
        this.loader.close();
      }
    );
  }
  
  
  

  private fetchData(): void {
    this.getItemSub = this.GpbfService.getnotgenerated().subscribe(data => {
      console.log('Service data:', data);
  
      this.groupedData = groupBy(data, item => {
        if (item.updatedAt && new Date(item.updatedAt).getTime() > new Date(item.createdAt).getTime()) {
          return this.formatDate(item.updatedAt);
        }
        return this.formatDate(item.createdAt);
      });
    });
  }
isAllGenerated(dateKey: string): boolean {
  const dataSet = this.groupedData[dateKey];
  return dataSet.every(row => Number(row.pbfgenerated) === 0);
 
}

isPartiallyGenerated(dateKey: string): boolean {
  const dataSet = this.groupedData[dateKey];
  return dataSet.some(row => Number(row.pbfgenerated) === 0);
}

}
