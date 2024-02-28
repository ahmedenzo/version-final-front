import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { groupBy } from 'lodash';
import { GeneratedfileService } from '../../generatedfile.service';
import { CardHolder, updatecode } from 'app/shared/models/Cardholder';
import { ChangeDetectorRef } from '@angular/core';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-generatedfile',
  templateUrl: './generatedfile.component.html',
  styleUrls: ['./generatedfile.component.scss']
})
export class GeneratedfileComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  openedPanels: number[] = [];
  public dataSource: any;
  public groupedDataKeys: string[];
  public groupedData: { [date: string]: any[] } = {};
  public displayedColumns: any;
  public getItemSub: Subscription;
  public panelsWithGeneratedFiles: number[] = [];
  fileHistory = [];


  constructor(
    private loader: AppLoaderService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private GeneratedfileService: GeneratedfileService,
    private translate: TranslateService
   

  
  ) {}

  ngOnInit() {
    this.panelsWithGeneratedFiles = JSON.parse(localStorage.getItem('generatedPanels') || '[]');
    // ... rest of the code
    const generatedPanels = JSON.parse(localStorage.getItem('generatedPanels') || '[]');
    this.panelsWithGeneratedFiles = generatedPanels;
    this.displayedColumns = this.getDisplayedColumns();
    this.getItemSub = this.GeneratedfileService.getConfirmedCardHolders()
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
  }    
  

  getCardCountToGenerate(group: string): number {
    const dataSet = this.groupedData[group];
    return dataSet.reduce((sum, row) => sum + (Number(row.cardgenerated) === 0 ? 1 : 0), 0);
  }

  getPanelColor(dateKey: string): string {
    const panelIndex = this.groupedDataKeys.indexOf(dateKey);
    if (this.panelsWithGeneratedFiles.includes(panelIndex)) {
      return '#90EE90';  // Green color
    }
  
    const dataSet = this.groupedData[dateKey];
    const anyCardNotGenerated = dataSet.some(row => Number(row.cardgenerated) === 0);
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
    return ['CardholderNumber','CardHolderName' ,'Valid','createdAt','updatedAt', 'status'];
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

  
  getStatusColor(status: string): string {
    switch (status) {
      case 'Card_Update':
        return 'pink';
      case 'Card_Cancellation':
        return 'red';
      case 'Card_Renewal':
        return 'yellow';
      default:
        return ''; 
    }
  }

  getStatusChipColor(status: string): string {
    switch (status) {
      case 'Card_Update':
        return 'primary';
      case 'Card_Cancellation':
        return 'warn';    
      case 'Card_Renewal':
        return 'accent';  
      default:
        return 'basic';   
    }
  }


  getStatusTranslationKey(status: string): string {
    switch (status) {
      case updatecode.Card_First_Creation:
        return 'CARD_FIRST_CREATION';
      case updatecode.Card_Update:
        return 'CARD_UPDATE';
      case updatecode.Card_Cancellation:
        return 'CARD_CANCELLATION';
      case updatecode.Card_Renewal:
        return 'CARD_RENEWAL';
      default:
        return '';
    }
  }

  onFileUploaded(event: any) {
 
    console.log('File uploaded:', event);
   
  }
  
  generateFileForData(dateKey: string): void {
    console.log('Generate button clicked for dateKey:', dateKey);
    const dataSet = this.groupedData[dateKey];
    console.log('Data for generation:', dataSet);
  
    // Filter out already generated card IDs
    const customerIdsToGenerate = dataSet
      .filter(row => Number(row.cardgenerated) === 0) // Filter out rows with cardgenerated = 0
      .map(row => row.customerId);
  
    if (customerIdsToGenerate.length === 0) {
      const snackMessage = this.translate.instant('All cards are already generated!', 'info');
      this.snack.open(snackMessage, 'OK', { duration: 4000 });
      return; // No need to make API call if all cards are already generated
    }
  
    const loaderMessage = this.translate.instant('Generating Cards');
    this.loader.open(loaderMessage);
  
    this.GeneratedfileService.generateDataInputForCards(customerIdsToGenerate).subscribe(
      data => {
        console.log('Generated Data:', data);
        const snackMessage = this.translate.instant('File generated and saved successfully!', 'success');
        this.snack.open(snackMessage, 'OK', { duration: 4000 });
        this.loader.close();
  
        // Update panel color to green immediately after successful file generation
        const panelIndex = this.groupedDataKeys.indexOf(dateKey);
        const panels = document.querySelectorAll('.mat-expansion-panel'); // Get all panels
  
        panels.forEach((panel, index) => {
          if (index === panelIndex) {
            // Typecast the element to HTMLElement before accessing the style property
            (panel as HTMLElement).style.backgroundColor = '#90EE90'; // Green color
          }
        });
      },
      error => {
        console.error('Error generating data:', error);
        const snackMessage = this.translate.instant('Error generating file. Please try again later.', 'error');
        this.snack.open(snackMessage, 'OK', { duration: 4000 });
        this.loader.close();
      }
    );
  }
  


isAllGenerated(dateKey: string): boolean {
  const dataSet = this.groupedData[dateKey];
  return dataSet.every(row => Number(row.cardgenerated) === 1);
 
}

isPartiallyGenerated(dateKey: string): boolean {
  const dataSet = this.groupedData[dateKey];
  return dataSet.some(row => Number(row.cardgenerated) === 0);
}

}
