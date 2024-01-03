import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { NgxTablePopupComponent } from 'app/views/cruds/crud-ngx-table/ngx-table-popup/ngx-table-popup.component';
import { UpdateCardService } from '../../update-card.service';
import { Subscription } from 'rxjs';
import { PopupUpdateComponent } from '../popup-update/popup-update/popup-update.component';
import { CardHolder, updatecode } from 'app/shared/models/Cardholder';
import { Notifications2Service } from 'app/shared/components/egret-notifications2/notifications2.service';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-update-table',
  templateUrl: './update-table.component.html',
  styleUrls: ['./update-table.component.scss']
})
export class UpdateTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public displayedColumns: any;
  public getItemSub: Subscription;
  public isUpdateMode: boolean;
  updateCodeOptions: string[] = Object.values(updatecode);
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private crudService: UpdateCardService,
    private loader: AppLoaderService,private Notifications2Service:Notifications2Service,
    private translateService: TranslateService
  ) { }

  ngOnInit() {

    this.displayedColumns = this.getDisplayedColumns();
    this.getItems()
    console.log("data",this.dataSource.data.values())
    
  
  }
  getTranslatedStatus(status: string): string {
    let translationKey: string;

    switch (status) {
      case 'Card_First_Creation':
        translationKey = 'CARD_FIRST_CREATION';
        break;
      case 'Card_Update':
        translationKey = 'CARD_UPDATE';
        break;
      case 'Card_Cancellation':
        translationKey = 'CARD_CANCELLATION';
        break;
      case 'Card_Renewal':
        translationKey = 'CARD_RENEWAL';
        break;
      default:
        translationKey = ''; // default translation or key
        break;
    }

    // Translate the key to the corresponding value in the active language
    return this.translateService.instant(translationKey);
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
    return ['CardholderNumber','CardHolderName', 'FirstAccount' ,'Valid', 'CIN','phoneNumber','createdAt', 'status','actions'];
  }

  getItems() {    
    this.getItemSub = this.crudService.getConfirmedCardHolders()
      .subscribe(data => {
        // Sort data by createdAt in descending order
        data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.dataSource = new MatTableDataSource(data);
      });
}

openPopUp(data: any = {}, actionType: string) {
  let titleKey = '';
  let loaderMessageKey = '';
  let snackMessageKey = '';

  if (actionType === 'updated') {
    titleKey = 'UPDATE_CARD';
    loaderMessageKey = 'UPDATING_CARD';
    snackMessageKey = 'CARD_UPDATED';
  } else if (actionType === 'renewed') {
    titleKey = 'RENEW_CARD';
    loaderMessageKey = 'RENEWING_CARD';
    snackMessageKey = 'CARD_RENEWED';
  } else if (actionType === 'canceled') {
    titleKey = 'CANCEL_CARD';
    loaderMessageKey = 'CANCELING_CARD';
    snackMessageKey = 'CARD_CANCELED';
  }

  const title = this.translateService.instant(titleKey);
  const loaderMessage = this.translateService.instant(loaderMessageKey);
  const snackMessage = this.translateService.instant(snackMessageKey);

  let dialogRef: MatDialogRef<any> = this.dialog.open(PopupUpdateComponent, {
    width: '720px',
    disableClose: true,
    data: { title: title, payload: { ...data, actionType: actionType } }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log("res",result)
      this.loader.open(loaderMessage);
      this.crudService.updateCardHolderData(data.customerId, result.binId, result).subscribe(updatedCardHolder => {
        const index = this.dataSource.data.findIndex(item => item.customerId === data.customerId);
        if (index !== -1) {
        
          this.dataSource.data[index] = updatedCardHolder;
          this.dataSource._updateChangeSubscription(); // Refresh the table
      this.getItems()
          this.loader.close();
          this.snack.open(snackMessage, 'OK', { duration: 4000 });
        } else {
          console.error('CardHolder not found in data source');
        }
      });
    }
  });
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
  



  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  applyUpdateCodeFilter(event: any) {
    const selectedUpdateCode = event.value;
  
    if (selectedUpdateCode) {
      this.dataSource.filter = selectedUpdateCode.trim().toLowerCase();
    } else {
      this.dataSource.filter = '';
    }
  }
  
}