import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'app/shared/models/user.model';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Observable, Subscription } from 'rxjs';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service'; 
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

import { ProfileBlankComponent } from '../profile-blank/profile-blank.component';
import { PopUpComponent } from '../profile-deux/pop-up/pop-up.component';
@Component({
  selector: 'app-profile-overview',
  templateUrl: './profile-overview.component.html',
  styleUrls: ['./profile-overview.component.css']
})
export class ProfileOverviewComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  items;
  public dataSource: MatTableDataSource<any>;
  public displayedColumns: any;
  public getItemSub: Subscription;
  userr: any;
  user: Observable<User>;
  username: any;
  userRole:any
  id: number;
  customerid: any;
  roles: string[];
  imageUrls: any = {}; // Define an object to store image URLs

  constructor(
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private confirmService: AppConfirmService,
    private JwtAuthService: JwtAuthService
  ) {
    this.dataSource = new MatTableDataSource<User>([]);
  }

  getDisplayedColumns() {
    return ["image", "username","fullName","Email", "Phone","Bank", "roles", "confirme", "actions"];
  }
  getDisplayedColumns1() {
    return ["image", "username","fullName","Email", "Phone","Agence", "roles", "confirme", "actions"];
  }
  ngOnInit(): void {
    const storedRoles = localStorage.getItem('roles');
    if (storedRoles) {
      this.roles = this.JwtAuthService.roles;
      this.roles = JSON.parse(storedRoles);
      // Check if the user has the admin role
      const isAdmin = this.roles.includes('Admin_Bank');
      // Select appropriate displayed columns based on the user's role
      if (isAdmin) {
        this.displayedColumns = this.getDisplayedColumns1();
      } else {
        this.displayedColumns = this.getDisplayedColumns();
      }
    } else {
      this.roles = this.JwtAuthService.roles;
      // Set default displayed columns (you can choose one of the methods here)
      this.displayedColumns = this.getDisplayedColumns();
    }
    this.user = this.JwtAuthService.user$;
   

    this.username = this.JwtAuthService.getUser();
    this.getuserinformation();

    this.getItems();

  }
  
  getItems() {
    let getAllCustomersObservable;
  
    if (this.roles.includes("Admin_SMT")) {
      getAllCustomersObservable = this.JwtAuthService.getAllCustomersForUser();
    } else if (this.roles.includes("Admin_Bank")) {
      getAllCustomersObservable = this.JwtAuthService.getAllCustomersForUsers(this.id);
    }
  
    if (getAllCustomersObservable) {
      this.getItemSub = getAllCustomersObservable.subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.items = data;
  
        this.items.forEach((item) => {
          this.loadImage(item.id);
        });
      });
    }
  }
  
  loadImage(itemId: any) {
    this.JwtAuthService.getImage(itemId).subscribe((img) => {
      const reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onloadend = () => {
        const imageUrl = reader.result;
        this.imageUrls[itemId] = imageUrl;
      };
    });
  }
  ngOnDestroy(): void {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  applyFilter(event :Event){
    const FilterValue = (event.target as HTMLInputElement).value ;
     this.dataSource.filter = FilterValue.trim().toLowerCase();
 
 }


 getuserinformation(){
  this.JwtAuthService.getUserByUsername(this.username).subscribe(
    user => {
      this.userr = user;
      this.id=user.id
      console.log("test now")
      console.log(user.id)
      this.getItems()
    },
    error => {
      console.error(error);
    }
  );
}

  
  openPopUp(data: any, isNew?: boolean): void {
    let title = isNew ? 'Add new CustomerUser' : 'Update CustomerUser';
    let dialogRef: MatDialogRef<any> = this.dialog.open(PopUpComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        if (isNew) {
          if (this.roles.includes('Admin_SMT')) {
            this.loader.open('Adding new Admin');
            this.JwtAuthService.registerCustomerUser(res, res.bankName)
              .subscribe((data: any) => {
                if (data && data.error && data.error.message === 'Username or email is already used') {
                  this.snack.open('Username or email is already used', 'OK', { duration: 2000 });
                } else {
                  this.dataSource = data;
                  this.loader.close();
                  this.snack.open('Admin Added!', 'OK', { duration: 2000 });
                  this.getItems();
                }
              }, error => {
                console.error(error);
                this.snack.open('Username or email is already used', 'OK', { duration: 2000 });
              });
          } else {
            // Get adminId from user data (assuming it's stored in user object)
            const adminId = this.id;
            this.loader.open('Adding new Agent');
            this.JwtAuthService.registerAgentUser(res.agenceName, res, adminId)
              .subscribe((data: any) => {
                this.dataSource = data;
                this.loader.close();
                this.snack.open('Agent Added!', 'OK', { duration: 2000 });
                this.getItems();
           
              }, error => {
                // Handle errors if any
                // ...
              });
          }
        }
      });
  }
  
  
  
  
  openrole(item: any): void {
    const title = 'Update Role';
    const dialogRef = this.dialog.open(ProfileBlankComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: item }
    });
    dialogRef.afterClosed().subscribe(selectedRole => {
      if (!selectedRole) {
        return;
      }
      console.log("popup");
      console.log(selectedRole);
      this.JwtAuthService.updateCustomerRole(item.id, selectedRole).subscribe(
        (data: any) => {
          this.dataSource = data;
          this.snack.open('Role Added!', 'OK', { duration: 2000 });
          this.getItems();
        },
        error => {
          console.error(error);
          this.snack.open('Role Not Update', 'OK', { duration: 2000 });
        }
      );
    });
  }
  
  
  
  // Define a method to get image URL based on user ID
  getImageUrl(userId) {
    return this.imageUrls[userId];
  }





deleteItem(row) {
  this.confirmService.confirm({ message: `Delete ${row.username}?` }).subscribe(res => {
    if (res) {
      this.loader.open('Deleting CustomerUser');
      this.JwtAuthService.deleteCustomer(this.id, row).subscribe({
        next: data => {
          this.dataSource = data;
          this.loader.close();
          this.snack.open('CustomerUser deleted!', 'OK', { duration: 2000 });
          this.getItems();
        },
        error: err => {
          console.error(err);
          this.loader.close();
          this.snack.open('Error deleting CustomerUser!', 'OK', { duration: 2000 });
        }
      });
    }
  });
}


}





