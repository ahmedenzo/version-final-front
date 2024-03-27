import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { PbfService } from './pbf.service';
import { MatTableDataSource } from '@angular/material/table';
import { PbfpopupComponent } from './pbf-popup/pbfpopup/pbfpopup.component';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-createpbf',
  templateUrl: './createpbf.component.html',
  styleUrls: ['./createpbf.component.scss']
})
export class CreatepbfComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalBalance: number = 0;
  todayBalance: number = 0;
  public tokenExpirySubscription: Subscription;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  showOnlyTodayCreated: boolean = false;
  public displayedColumns: any;
  public getItemSub: Subscription;


  constructor(  private dialog: MatDialog,
    private snack: MatSnackBar,  private confirmService: AppConfirmService,private PbfService:PbfService ,private JwtAuthService:JwtAuthService,
    private loader: AppLoaderService)
    { }

    ngOnInit() {
      
      this.displayedColumns = this.getDisplayedColumns();
      this.getitems()

      this.tokenExpirySubscription = this.JwtAuthService.onTokenExpiry().subscribe(() => {
   
        this.closeAllPopupsAndSnacks();
      });
  
    
    }
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    ngOnDestroy() {
      if (this.getItemSub) {
        this.getItemSub.unsubscribe()
      }
      this.tokenExpirySubscription.unsubscribe();
    }
  
    getDisplayedColumns() {
      return ['name','cardholderNumber', 'Valid', 'available_balance', 'ledgBal','actions' ];
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

    getitems(): void {
      this.getItemSub = this.PbfService.getItems().subscribe(data => {
        // Sort the data array by the updatedAt field in descending order
        data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
        this.dataSource = new MatTableDataSource(data);
        console.log(this.dataSource.data);
    
        // Calculate total balance for all cards
        this.totalBalance = this.calculateTotalAvailableBalance(data);
    
        // Calculate total balance for today
        this.todayBalance = this.calculateTotalBalanceForToday(data);
    
        // Update HTML with total balance
        this.updateTotalBalance();
    
        // Update HTML with balance for today
        this.updateTodayBalance();
    
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
    
  
  calculateTotalAvailableBalance(data: any[]): number {
      // Calculate total available balance for all cards
      return data.reduce((sum, item) => sum + item.availBal, 0);
  }
  
  calculateTotalBalanceForToday(data: any[]): number {
      // Get today's date
      const today = new Date();
  
      // Filter items based on createdAt or updatedAt being today
      const todayItems = data.filter(item => {
          const itemDate = new Date(item.updatedAt); // Change this line if you want to use createdAt
          return itemDate.getDate() === today.getDate() &&
                 itemDate.getMonth() === today.getMonth() &&
                 itemDate.getFullYear() === today.getFullYear();
      });
  
      // Calculate total balance for today
      return this.calculateTotalAvailableBalance(todayItems);
  }

  
  updateTotalBalance(): void {
    // Format totalBalance with commas for thousands and two decimal places
    const formattedTotalBalance = (this.totalBalance / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
    // Update HTML element with the total balance
    const totalBalanceElement = document.querySelector('.Total-Balance');
    if (totalBalanceElement) {
      totalBalanceElement.textContent = `TotalBalance: $${formattedTotalBalance}`;
    }
  }
  
  updateTodayBalance(): void {
    // Format todayBalance with commas for thousands and two decimal places
    const formattedTodayBalance = (this.todayBalance / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
    // Update HTML element with the balance for today
    const todayBalanceElement = document.querySelector('.Balance-Today');
    if (todayBalanceElement) {
      todayBalanceElement.textContent = `Balance'sToday: $${formattedTodayBalance}`;
    }
  }
  
  
  
  

    openPopUp(data:any ) { 
     
      let dialogRef: MatDialogRef<any> = this.dialog.open(PbfpopupComponent, {
        width: '720px',
        disableClose: true,
        data: { payload: data }
      })
      dialogRef.afterClosed()
        .subscribe(res => {
          if(!res) {
            return;
          }
            this.loader.open('Adding PBF');
            this.PbfService.updatePBFRecord(data.id,res)
              .subscribe((data :any)=> {
                this.dataSource = data;
                this.loader.close();
                this.snack.open('PBF Added!', 'OK', { duration: 2000 });
                this.getitems();
              })
       
        })
    }
  

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
    
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
  
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const accumulator = (currentTerm, key) => {
          return key === 'pbfCardHolder' ? currentTerm + data.pbfCardHolder.name + data.pbfCardHolder.cardholderNumber + data.numAccount : currentTerm + data[key];
        };
        const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
  
        return dataStr.indexOf(filter) !== -1;
      };
    }
    applyTodayFilter() {
      const today = new Date();
      const todayFormatted = `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  
      // Filter the data source
      this.dataSource.filterPredicate = (data: any) => {
        const createdAt = new Date(data.createdAt);
        const createdAtFormatted = `${createdAt.getFullYear()}-${(
          createdAt.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}-${createdAt.getDate().toString().padStart(2, '0')}`;
        return createdAtFormatted === todayFormatted;
      };
  
      // Apply the filter value
      this.dataSource.filter = this.showOnlyTodayCreated ? 'showOnlyToday' : '';
    }
  
    // Other existing methods...
  
    toggleTodayFilter() {
      this.applyTodayFilter();
    }
    

  }
    
  