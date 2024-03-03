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


@Component({
  selector: 'app-createpbf',
  templateUrl: './createpbf.component.html',
  styleUrls: ['./createpbf.component.scss']
})
export class CreatepbfComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  showOnlyTodayCreated: boolean = false;
  public displayedColumns: any;
  public getItemSub: Subscription;


  constructor(  private dialog: MatDialog,
    private snack: MatSnackBar,  private confirmService: AppConfirmService,private PbfService:PbfService ,
    private loader: AppLoaderService)
    { }

    ngOnInit() {
      this.displayedColumns = this.getDisplayedColumns();
      this.getitems()
    
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
      return ['name','cardholderNumber', 'Valid', 'available_balance', 'ledgBal','actions' ];
    }
  

    getitems(){

   this.getItemSub = this.PbfService.getItems().subscribe(data => {

    this.dataSource = new MatTableDataSource(data);
    console.log(this.dataSource.data)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
   

   })

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
    
  