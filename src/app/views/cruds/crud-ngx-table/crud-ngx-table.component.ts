import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation,ElementRef } from '@angular/core';
import { CrudService } from '../crud.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { NgxTablePopupComponent } from './ngx-table-popup/ngx-table-popup.component';
import { Subscription } from 'rxjs';
import { egretAnimations } from "../../../shared/animations/egret-animations";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ACS, CardHolder, CardProcessIndicator, PKIiNDICATOR, RenewOption, Sourcecode, TerritoryCode, updatecode } from 'app/shared/models/Cardholder';
import { FileConfirmationDialogComponent } from '../crud-Dialog/file-confirmation-dialog/file-confirmation-dialog.component';
import { MatDateRangeInput, MatDatepickerInputEvent, MatEndDate, MatStartDate } from '@angular/material/datepicker';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ThemePalette } from '@angular/material/core';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { Notifications2Service } from 'app/shared/components/egret-notifications2/notifications2.service';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-crud-ngx-table',
  templateUrl: './crud-ngx-table.component.html',
  styleUrls: ['./crud-ngx-table.component.css'],

  animations: egretAnimations,
  encapsulation: ViewEncapsulation.None
})

export class CrudNgxTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currentDate: string;
  enumTypes = ['RenewOption', 'updatecode', 'Sourcecode', 'PKIiNDICATOR', 'ACS', 'CardProcessIndicator', 'TerritoryCode'];
  selectedEnumType: string = "any"; // Set the default value to "any"
  selectedEnumValues: string[] = [];
  selectedEnumValue: string[] = []; 
  selectedEnumValueObjects: { [key: string]: string[] } = {};
  public showAllCards: boolean = true;
  public showOnlyToday: boolean = false;
  public todayConfirmedCardCount: number = 0;
  public todayNotConfirmedCardCount: number = 0;
  public todayconfirmedAndGeneratedCardCount: number = 0;
  confirmedAndGeneratedCardCount: number = 0;
  selectedDate: Date | null = null;
  pageSizeOptions: number[];
  shouldApplyFilter: boolean = true;
  public confirmedCardCount: number = 0;
  public notConfirmedCardCount: number = 0;
 
  public currentFilterStatus: 'all' | 'confirmed' | 'notConfirmed' | 'confirmedAndGenerated' = 'all';
  totalItems: number;
  maxPages: number;
  public sessionExpiredSubscription;
  public tokenExpirySubscription: Subscription;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  selection = new SelectionModel<any>(true, []);
  public fileName: string;
  public displayedColumns: any;
  public isAddMode: boolean;
  public getItemSub: Subscription;
  public closed : boolean
  fb: any;
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private crudService: CrudService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private JwtAuthService :JwtAuthService,
    private Notifications2Service:Notifications2Service,private translate: TranslateService
  ) { 


  }
  

  ngOnInit() {
    this.tokenExpirySubscription = this.JwtAuthService.onTokenExpiry().subscribe(() => {
   
      this.closeAllPopupsAndSnacks();
    });



    this.displayedColumns = this.getDisplayedColumns();
    this.getItems();
    
    this.updateDateTime();
    // Update the date and time every second
    setInterval(() => this.updateDateTime(), 1000);
  
    // Initialize the page size options dynamically
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.connect().subscribe(data => {
      this.totalItems = data.length;
      this.setPageSizeOptions();
    });
    this.onEnumSelect(this.enumTypes[0]);
  }


  openPopUp(data: any = {}, isNew?) {
    let titleKey = isNew ? 'ADD_NEW_CARD' : 'UPDATE_CARD';
    const title = this.translate.instant(titleKey);
    let dialogRef: MatDialogRef<any> = this.dialog.open(NgxTablePopupComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: { ...data, isNew: isNew }, isAddMode: isNew }
    });
  
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      if (isNew) {
        const loaderMessage = this.translate.instant('ADD_NEW_CARD');
        this.loader.open(loaderMessage);
        console.log("res",res)
        this.crudService.addItem2(res.bin, res).subscribe(data => {
          this.dataSource.data = data;
          this.loader.close(); // Close the loader when the request is complete
          const snackMessage = this.translate.instant('CARD_ADDED');
          this.snack.open(snackMessage, 'OK', { duration: 4000 });
          this.getItems();
        }, error => {
          console.error('Error occurred', error);
          this.loader.close(); // Close the loader in case of an error
          if (error.status === 400 && error.error === "User already has a card") {
            // Display a snack bar message for the "User already has a card" error
            const errorMessage = this.translate.instant('USER ALREADY HAS CARD WITH THIS PASSPORT');
            this.snack.open(errorMessage, 'OK', { duration: 8000 }); // Show for 5 seconds
            // Close the dialog after 5 seconds
            setTimeout(() => {
              dialogRef.close();
            }, 5000); // Adjust the time as needed
          } else {
            // Handle other errors if necessary
          }
        });

      } else {
        const loaderMessage = this.translate.instant('UPDATE_CARD');
        this.loader.open(loaderMessage);
       
        console.log("Form bin:", res.cardHolder.bin);
        this.crudService.updateCardHolderData(data.customerId,res.cardHolder.bin,res.cardHolder).subscribe(data => {
          console.log("Form bin:", res.cardHolder.bin);
          console.log("update work");
          this.dataSource.data = data;
          this.loader.close();
          const snackMessage = this.translate.instant('CARD_UPDATED');
          this.snack.open(snackMessage, 'OK', { duration: 4000 });
          this.getItems();
        });
      }
    });
  }
  
  

  
  
  closeAllPopups() {
    // Close any open dialogs/popups
    const openedDialogs = this.dialog.openDialogs;
    openedDialogs.forEach((dialog: MatDialogRef<any>) => {
      dialog.close();
    });
  }
  
  closeAllSnacks() {
    // Dismiss any open snack bars
    this.snack.dismiss();
  }
  closeAllPopupsAndSnacks() {
    this.closeAllPopups();
    this.closeAllSnacks();
  }

  resetData(): void {
    // Reset the selected enum type and value to their initial states
    this.selectedEnumType = "any";
    this.selectedEnumValues = [];
    this.selectedEnumValueObjects = {}; // Reset the object containing selected values for each enum type
    // ... your existing code ...
  }
  onCheckboxChange(event: any, enumValue: string) {
    const enumType = this.selectedEnumType;
    if (event.checked) {
      // Add the selected enum value to the array
      if (!this.selectedEnumValueObjects[enumType]) {
        this.selectedEnumValueObjects[enumType] = [];
      }
      if (!this.selectedEnumValueObjects[enumType].includes(enumValue)) {
        this.selectedEnumValueObjects[enumType].push(enumValue);
      }
    } else {
      // Remove the selected enum value from the array
      const index = this.selectedEnumValueObjects[enumType]?.indexOf(enumValue);
      if (index !== undefined && index !== -1) {
        this.selectedEnumValueObjects[enumType].splice(index, 1);
      }
    }
  }
  



  onEnumSelect(enumType: string) {
    this.selectedEnumType = enumType;
    this.selectedEnumValues = this.getEnumValues(enumType);
    this.selectedEnumValue = []; // Reset the selectedEnumValue array when enumType is changed
  }

  setPageSizeOptions() {
    // Calculate the number of pages based on the total items and desired page sizes
    const pages = Math.ceil(this.totalItems / this.paginator.pageSize);
    this.pageSizeOptions = [];
    for (let i = 1; i <= pages; i++) {
      this.pageSizeOptions.push(i * this.paginator.pageSize);
    }
  }

  
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  translateStatus(status: string): string {
  switch (status) {
    case 'ConfirmedAndGenerated':
      return 'GENERATED';
    case 'Confirmed':
      return 'CONFIRMED';    
    case 'Not Confirmed':
      return 'NOTCONFIRMED';  
    default:
      return 'DEFAULT_STATUS';   
  }
}

  
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }
    this.tokenExpirySubscription.unsubscribe();
  }
  updateDateTime() {
    const now = new Date();

    // Format the date and time manually
    const year = now.getFullYear();
    const month = this.padZero(now.getMonth() + 1);
    const day = this.padZero(now.getDate());
  
    this.currentDate = `${year}-${month}-${day}`;
   
  }
  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  getDisplayedColumns() {
    return ['select','CardNumber' ,'Valid','CardHolderName', 'PASSPORT_ID','PhoneNumber', 'status','createdAt','actions'];
  }
  getItems() {
    this.getItemSub = this.crudService.getItems().subscribe(data => {
      data.sort((a, b) => {
        return data.indexOf(b) - data.indexOf(a);
      });
  
      this.dataSource.data = data;
          console.log(data)
      // Calculate the counts of confirmed and not confirmed cards
      this.confirmedCardCount = data.filter(item => item.confirmation).length;
      this.notConfirmedCardCount = data.filter(item => !item.confirmation).length;
      this.confirmedAndGeneratedCardCount = data.filter(item => item.confirmation && item.cardgenerated).length;
   
      
    });
  }
  
  
  
  

  openConfirmationDialog() {
    const title = this.translate.instant('CONFIRMATION');
  const text = this.translate.instant('do you want confirm this card');
    const dialogRef = this.dialog.open(FileConfirmationDialogComponent, {
      width: '400px',
      data: { title, text }
    });
  
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        const unconfirmedRows = this.selection.selected.filter(row => !row.confirmation);
        if (unconfirmedRows.length > 0) {
          this.confirmcard();
        }
     
      
      }
      
      

    });
    
  }
  
  
  confirmCart(customerId :number) {
  
    this.crudService.confirmDataInputCart(customerId).subscribe(
      (response: any) => {
        
        console.log(response);
      },
      (error: any) => {
        
        console.error(error);
      }
    );
  }
  

  
  


  deleteItem(row) {
    const title = this.translate.instant('CONFIRMATION');
    const text = this.translate.instant('DO YOU WANT TO DELETE THIS CARD?');
    const dialogRef = this.dialog.open(FileConfirmationDialogComponent, {
      width: '400px',
      data: { title, text },
      panelClass: 'red-dialog'
    });
  
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.loader.open('Deleting card');
        this.crudService.deleteCardHolder(row).subscribe(
          data => {
            this.dataSource.data = data;
            this.loader.close();
            this.snack.open('Card deleted!', 'OK', { duration: 2000 });
            this.getItems();
          },
          error => {
            this.loader.close();
            if (error && error.error && error.error.message) {
              this.snack.open(error.error.message, 'OK', { duration: 4000, panelClass: 'error-snackbar' });
            } else {
              this.snack.open('Unable to delete confirmed card!', 'OK', { duration: 4000, panelClass: 'error-snackbar' });
            }
          }
        );
      }
    });
  }
  
  
  

  
  
  
  
  
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

 
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

 confirmDataInputCart(id: number) {
  this.crudService.confirmDataInputCart(id).subscribe(
    () => {
      console.log('Confirmation successful.');


      const selectedRows = this.selection.selected;
      selectedRows.forEach((row: CardHolder) => {
        row.confirmation = true; 
      });

    },
    (error) => {
      console.error('Confirmation failed:', error);
   
    }
  );
}

confirmcard() {
  const selectedRows = this.selection.selected.filter(row => !row.confirmation);
  const fileName = this.fileName;

  if (selectedRows.length === 0) {
    return;
  }

  selectedRows.forEach((row: CardHolder) => {
    row.confirmation = true;
    this.confirmDataInputCart(row.customerId);
  });


 
}

getColor(row: any): string {
  const status = this.getStatus(row);
  if (status === 'ConfirmedAndGenerated') {
    return 'primary';
  } else if (status === 'Confirmed') {
    return 'confirmed';
  } else {
    return 'default-color'; // Set a default color class if needed
  }
}

getStatus(row: any) {
  if (row.confirmation && row.cardgenerated) {
    return 'ConfirmedAndGenerated'; // Or any other text for confirmed and generated
  }
  return row.confirmation ? 'Confirmed' : 'Not Confirmed';
}


isSelected(row: any) {
  return row.confirmation || (row.confirmation && row.cardgenerated);
}







openPopupftp(file: any): void {
 
  console.log(file);
  
 
}


getEnumValues(enumType: string): string[] {
  switch (enumType) {
    case 'RenewOption':
      return Object.keys(RenewOption).map(key => RenewOption[key]);
    case 'updatecode':
      return Object.keys(updatecode).map(key => updatecode[key]);
    case 'Sourcecode':
      return Object.keys(Sourcecode).map(key => Sourcecode[key]);
    case 'PKIiNDICATOR':
      return Object.keys(PKIiNDICATOR).map(key => PKIiNDICATOR[key]);
    case 'ACS':
      return Object.keys(ACS).map(key => ACS[key]);
    case 'CardProcessIndicator':
      return Object.keys(CardProcessIndicator).map(key => CardProcessIndicator[key]);
    case 'TerritoryCode':
      return Object.keys(TerritoryCode).map(key => TerritoryCode[key]);
    default:
      return [];
  }
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  const filterConditions = [];

  if (this.currentFilterStatus !== 'all') {
    filterConditions.push((data: CardHolder) => this.applyFilterByConfirmationStatusPredicate(data, this.currentFilterStatus));
  }

  if (this.selectedDate && this.showOnlyToday) {
    const selectedDateStr = this.formatDate(this.selectedDate);
    filterConditions.push((data: CardHolder) => this.applyFilterByDatePredicate(data, selectedDateStr));
  }

  if (filterValue.trim().length > 0) {
    this.dataSource.filterPredicate = (data: CardHolder) => {
      const textFilter = this.dataSource.filter.trim().toLowerCase();
      return filterConditions.every(filterCondition => filterCondition(data)) &&
             this.filterByGeneralText(data, textFilter);
    };
  } else {
   
    this.dataSource.filterPredicate = null;
  }


  this.dataSource._updateChangeSubscription();
}





applyFilterByConfirmationStatusPredicate(data: CardHolder, filterStatus: 'all' | 'confirmed' | 'notConfirmed'| 'confirmedAndGenerated'): boolean {
  this.currentFilterStatus = filterStatus;
  if (filterStatus === 'all') {
    return true;
  } else if (filterStatus === 'confirmed') {
    return data.confirmation === true;
  } else if (filterStatus === 'notConfirmed') {
    return data.confirmation === false;
  }
  else if (filterStatus === 'confirmedAndGenerated') {
    return data.confirmation === true && data.cardgenerated === true;
  }
  return true;
}


applyFilterByDatePredicate(data: CardHolder, selectedDateStr: string): boolean {
  const createdAtDateStr = this.formatDateFromString(data.createdAt);
  return createdAtDateStr === selectedDateStr;
}


filterByGeneralText(data: CardHolder, textFilter: string): boolean {
  const fieldsToFilter = ['cardholderNumber', 'firstAccount',"secondAccount" , 'cin', 'phoneNumber',"name","address","passportId","birthDate","julianDate","acs"];
  for (const field of fieldsToFilter) {
    if (data[field]?.toLowerCase().includes(textFilter)) {
      return true; 
    }
  }
  return false; 
}








applyFilterByConfirmationStatus(filterStatus: 'all' | 'confirmed' | 'notConfirmed' | 'confirmedAndGenerated') {
  let selectedDateStr: string;

  if (this.showOnlyToday && this.selectedDate) {
    selectedDateStr = this.formatDate(this.selectedDate);
    this.dataSource.filterPredicate = (data: CardHolder, filter: string) => {
      const createdAtDateStr = this.formatDateFromString(data.createdAt);

      if (filterStatus === 'all') {
        return createdAtDateStr === selectedDateStr;
      } else if (filterStatus === 'confirmed') {
        return data.confirmation && createdAtDateStr === selectedDateStr;
      } else if (filterStatus === 'notConfirmed') {
        return !data.confirmation && createdAtDateStr === selectedDateStr;
      }
    };
  } else {
    this.dataSource.filterPredicate = (data: CardHolder, filter: string) => {
      if (filterStatus === 'all') {
        return true;
      } else if (filterStatus === 'confirmed') {
        return data.confirmation === true;
      } else if (filterStatus === 'notConfirmed') {
        return data.confirmation === false;
      } else if (filterStatus === 'confirmedAndGenerated') {
        return data.confirmation && data.cardgenerated;
      }
    };
  }


  this.dataSource.filter = 'filter'; 
  this.dataSource._updateChangeSubscription(); 


  if (this.showOnlyToday && this.selectedDate) {
    this.todayConfirmedCardCount = this.dataSource.data.filter(item => item.confirmation && this.formatDateFromString(item.createdAt) === selectedDateStr).length;
    this.todayNotConfirmedCardCount = this.dataSource.data.filter(item => !item.confirmation && this.formatDateFromString(item.createdAt) === selectedDateStr).length;
    this.todayconfirmedAndGeneratedCardCount= this.dataSource.data.filter(item =>  item.cardgenerated && this.formatDateFromString(item.createdAt) === selectedDateStr).length;
  } else {
    this.confirmedCardCount = this.dataSource.data.filter(item => item.confirmation).length;
    this.notConfirmedCardCount = this.dataSource.data.filter(item => !item.confirmation).length;
    this.confirmedAndGeneratedCardCount=this.dataSource.data.filter (item => item.confirmation && item.cardgenerated ).length;
  }
}






toggleDateFilter() {
  if (this.showOnlyToday) {
    this.selectedDate = new Date(); 
    this.applyFilterByConfirmationStatus(this.currentFilterStatus); 
  } else {
    this.selectedDate = null;
    this.applyFilterByConfirmationStatus(this.currentFilterStatus); 
  }
}



applyCreatedAtFilter() {
  if (this.selectedDate) {
    this.dataSource.filterPredicate = (data: CardHolder, filter: string) => {
      const selectedDateStr = this.formatDate(this.selectedDate);
      const createdAtDateStr = this.formatDateFromString(data.createdAt);

      return createdAtDateStr === selectedDateStr;
    };

    this.dataSource.filter = 'filter'; 

    
    this.dataSource.filterPredicate = null;
  } else {
    
    this.dataSource.filter = '';
  }
}

applyCreatedAtFilterdate() {
  if (this.showOnlyToday) {
    const today = new Date();
    const todayDateStr = this.formatDate(today);
    this.dataSource.filterPredicate = (data: CardHolder, filter: string) => {
      const createdAtDateStr = this.formatDateFromString(data.createdAt);
      return createdAtDateStr === todayDateStr; 
    };

   
    this.dataSource.filter = 'filter'; 
    this.dataSource._updateChangeSubscription(); 

    // Calculate the counts of confirmed and not confirmed cards for today
    this.todayConfirmedCardCount = this.dataSource.data.filter(item => item.confirmation && this.formatDateFromString(item.createdAt) === todayDateStr).length;
    this.todayNotConfirmedCardCount = this.dataSource.data.filter(item => !item.confirmation && this.formatDateFromString(item.createdAt) === todayDateStr).length;
    this.todayconfirmedAndGeneratedCardCount= this.dataSource.data.filter(item => item.confirmation && item.cardgenerated && this.formatDateFromString(item.createdAt) === todayDateStr).length;
  } else {
    // Clear the filter if 'showOnlyToday' is false
    this.dataSource.filter = '';
    this.dataSource._updateChangeSubscription(); 
    this.todayConfirmedCardCount = 0;
    this.todayNotConfirmedCardCount = 0;
    this.todayconfirmedAndGeneratedCardCount = 0;
  }
}




formatDate(date: Date): string {
  return moment(date).format('YYYY/MM/DD');
}

formatDateFromString(dateStr: string): string {
  return moment(dateStr, 'YYYY/MM/DD').format('YYYY/MM/DD');
}
twoDigitFormat(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}


dateChanged(event: MatDatepickerInputEvent<Date>) {
  this.selectedDate = event.value;
}

clearDateFilter() {
  this.selectedDate = null;
  this.applyCreatedAtFilter();
}


}












  