import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { CafService } from '../caf.service';

import { CardStatus } from 'app/shared/models/Cardholder';



function convertEnumToNumeric(status: CardStatus): string {
  switch (status) {
    case CardStatus.Issued_But_Not_Active:
      return "0";
    case CardStatus.Open:
      return "1";
    case CardStatus.Stolen_Card:
      return "2";
      case CardStatus.Lost_Card:
        return "3";
    case CardStatus.Restricted:
      return "4";
    case CardStatus.VIP:
      return "5";
    case CardStatus.Check_Reason_Code:
      return "6";
    case CardStatus.Closed:
      return "9";
    case CardStatus.Referral:
      return "A";
    case CardStatus.Maybe:
      return "B";
    case CardStatus.Denail:
      return "C";
    case CardStatus.Signature_Required:
      return "D";
    case CardStatus.Country_Club:
      return "E";
    case CardStatus.Expired_Card:
      return "F";
    case CardStatus.Commercial:
      return "G";
    default:
      throw new Error("Invalid CardStatus value");
  }
}


@Component({
  selector: 'app-caftable',
  templateUrl: './caftable.component.html',
  styleUrls: ['./caftable.component.scss']
})
export class CaftableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  cardstausValues: any ;
  cardStatusOption = Object.values(CardStatus);
  public dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public displayedColumns: any;
  public getItemSub: Subscription;
  showOnlyTodayCreated: boolean = false;
 


  constructor(  private dialog: MatDialog,private snackBar: MatSnackBar,
    private snack: MatSnackBar,  private confirmService: AppConfirmService,private cafService:CafService ,
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
      return ['name','cardholderNumber', 'Valid', 'cardStatus' ];
    }
  

    getitems() {
      this.getItemSub = this.cafService.getItems().subscribe(data => {
    
        data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
    

    convertNumericToEnum(value: any): CardStatus {
      switch (value) {
        case "0":
          return CardStatus.Issued_But_Not_Active;
        case "1":
          return CardStatus.Open;
        case "2":
          return CardStatus.Stolen_Card;
        case "3":
          return CardStatus.Lost_Card;
        case "4":
          return CardStatus.Restricted;
        case "5":
          return CardStatus.VIP;
        case "6":
          return CardStatus.Check_Reason_Code;
        case "9":
          return CardStatus.Closed;
        case 'A':
          return CardStatus.Referral;
        case 'B':
          return CardStatus.Maybe;
        case 'C':
          return CardStatus.Denail;
        case 'D':
          return CardStatus.Signature_Required;
        case 'E':
          return CardStatus.Country_Club;
        case 'F':
          return CardStatus.Expired_Card;
        case 'G':
          return CardStatus.Commercial;
        
      }
    }



    saveChanges(row: any) {
      const numericCardStatus = convertEnumToNumeric(row.cardStatus);
      this.cafService.updatecafRecord(row.id, {
        ...row,
        cardStatus: numericCardStatus
      }).subscribe(
        (data: any) => {
          this.getitems();
          this.openSnackBar('Changes saved successfully', 'Success');
        },
        (error: any) => {
          console.error('Error occurred while saving changes:', error);
          this.openSnackBar('Error occurred while saving changes', 'Error');
        }
      );
  
      console.log('Original Card Status:', row.originalCardStatus);
      console.log('Updated Card Status:', numericCardStatus);
    }
  
    openSnackBar(message: string, action: string) {
      this.snackBar.open(message, action, {
        duration: 2000, // Duration of the snackbar in milliseconds
      });
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
    
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
  
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const accumulator = (currentTerm, key) => {
          return key === 'cafCardHolder' ? currentTerm + data.cafCardHolder.name + data.pan + data.acctNum + data.cafCardHolder.date2  : currentTerm + data[key];
        };
        const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
  
        return dataStr.indexOf(filter) !== -1;
      };
    }

    applyFilter2(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
      // Filter the data source
      this.dataSource.filterPredicate = (data: any) => {
        const createdAt = new Date(data.createdAt);
        const today = new Date();
        return (
          createdAt.getDate() === today.getDate() &&
          createdAt.getMonth() === today.getMonth() &&
          createdAt.getFullYear() === today.getFullYear()
        );
      };
      this.dataSource.filter = filterValue;
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
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

  
