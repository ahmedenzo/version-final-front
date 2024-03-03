import { Component, OnDestroy, OnInit, Pipe, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Bank,ConfigureDataRequest,Bin, agence,confftp,SMTPCONF } from 'app/shared/models/bank';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Subscription, Observable } from 'rxjs';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { Service } from '../../profile.service';
import { BankpopupComponent } from './bank-popup/bankpopup/bankpopup.component';
import { ConfigurationComponent } from './bank-popup/configuration/configuration.component';
import { BinpopupComponent } from './binpopup/binpopup/binpopup.component';
import { AgencypopupComponent } from './agencepopup/agencypopup/agencypopup.component';
import { ConfComponent } from './conf/conf.component';
import { SmptppopupComponent } from './smptppopup/smptppopup.component';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss'],

 
})

export class BankComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  public dataSource: MatTableDataSource<Bank>;
  panelStates: { [key: string]: boolean } = {};
  public dataSource3: MatTableDataSource<Bin>;
  public dataSource6: MatTableDataSource<SMTPCONF>;
  public dataSource5: MatTableDataSource<confftp>;
  public dataSource4: MatTableDataSource<agence>;
  public dataSource1: MatTableDataSource<ConfigureDataRequest>;
  public displayedColumns: string[] = ['bankName', 'bankIdCode', 'bankLocation', 'contactEmail', 'contactPhone', 'countryCode',,'actions'];
  public confbins : ConfigureDataRequest [];
  public confbanksid: any[] = [];
  public banks: Bank[] = [];
  public openedPanels: number[] = [];
  public openedPanels1: number[] = [];
  public getItemSub: Subscription;
  private subscriptions: Subscription[] = [];
  roles: string[] = [];
  isNew: boolean = true; 
  constructor(
    
    private jwtAuthService: JwtAuthService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private Service: Service,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,

  ) {
    this.dataSource = new MatTableDataSource<Bank>([]);
    this.dataSource3= new MatTableDataSource<Bin>([]);
    this.dataSource6= new MatTableDataSource<SMTPCONF>([]);
    this.dataSource5= new MatTableDataSource<confftp>([]);
    this.dataSource4= new MatTableDataSource<agence>([]);
    this.dataSource1= new MatTableDataSource<ConfigureDataRequest>([]);
  }

  ngOnInit() {
    this.displayedColumns = this.getDisplayedColumns();
    this.getItems();
    this.getItemss();
    this.getIsmtp();
    
  
    const storedRoles = localStorage.getItem('roles');
    if (storedRoles) {
      this.roles = this.jwtAuthService.roles;
      this.roles = JSON.parse(storedRoles);
    } else {
      this.roles = this.jwtAuthService.roles;
    }
  }
    



  
  getItemss() {
    this.getItemSub = this.Service.getItemsbanks()
      .subscribe((data: any) => {
        this.banks = data.map((bank: any) => {
          return {
            bankId: bank.bankId,
            bankName: bank.bankName,
            bankFTPConfig: bank.bankFTPConfig,
            server: bank.server,
            username: bank.username,
            data: [],
            ftp: [] , // Initialize data property as an empty array for each bank
            agencies: [], // Initialize agencies property as an empty array for each bank
            // Initialize configurations property as an empty array for each bank
          };
        });
  
        // Fetch additional information for each bank
        this.banks.forEach((bank, index) => {
          // Fetch bins for each bank
          this.Service.getBinsByBank(bank.bankName).subscribe((bins: any) => {
            this.banks[index].data = bins; // Assign fetched bins to the respective bank
            console.log('Bins for bank ' + bank.bankName + ':', bins); // Log the bins for each bank
          });
  
          // Fetch agencies for each bank
          this.Service.getAgenciesByBank(bank.bankName).subscribe((agencies: any) => {
            this.banks[index].agencies = agencies; // Assign fetched agencies to the respective bank
            console.log('Agencies for bank ' + bank.bankName + ':', agencies); // Log the agencies for each bank
            this.Service.getConfigureDataByBinId(bank.bankId)
          });
  
          // Fetch FTP configurations for each bank
          this.Service.getFTPConfigurationByBank(bank.bankId).subscribe((conf: any) => {
            this.banks[index].ftp = conf; // Assign fetched configurations to the respective bank
            console.log('Configuration for bank ' + bank.bankName + ':', conf); // Log the configurations for each bank
           
          });
        });
        
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }
  
  getItems() {
    this.getItemSub = this.Service.getItemsbanks()
      .subscribe((data: any) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(data);
      });
  }

getIsmtp() {
  this.getItemSub = this.Service.getSmtpConfig().subscribe({
    next: (response: any) => {
      // Wrap the response object in an array
      const data = [response];
      // Assign the data to the MatTableDataSource
      this.dataSource6 = new MatTableDataSource(data);
      console.log("getsmtp", response);
    },
    error: (error) => console.error(error)
  });
}

  
openPopUpsmtp() {
  const dialogRef = this.dialog.open(SmptppopupComponent, {
    width: '720px',
    disableClose: true,
    data: { title: 'Update SMTP Configuration', payload: this.dataSource6.data.length > 0 ? this.dataSource6.data[0] : null }
  });

  dialogRef.afterClosed().subscribe(res => {
    if (res) {
      if (this.dataSource6.data.length > 0) {
        this.Service.updateSmtpConfig(res).subscribe(response => {
          this.getIsmtp();
        });
      } else {
        this.Service.createSmtpConfig(res).subscribe(response => {
          this.getIsmtp();
        });
      }
    }
  });
}






  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  togglePanel(bankId: number) {
    const index = this.openedPanels.indexOf(bankId);
    if (index === -1) {
      this.openedPanels.push(bankId);
    } else {
      this.openedPanels.splice(index, 1);
    }
  }

  isPanelOpen(bankId: string): boolean {
    return this.panelStates[bankId];
  }

  togglePanel1(bankId: number) {
    const index = this.openedPanels1.indexOf(bankId);
    if (index === -1) {
      this.openedPanels1.push(bankId);
    } else {
      this.openedPanels1.splice(index, 1);
    }
  }

  isPanelOpen1(bankId: number): boolean {
    return this.openedPanels1.includes(bankId);
  }
  getDisplayedColumns() {
    return ['bankName','bankIdCode','bankLocation','contactEmail','contactPhone','countryCode','actions'];
  }




  ngAfterViewInit() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }





  openPopUp(data:  any , isNew?) { 
    let title = isNew ? 'Add new Bank' : 'Update Bank';
    let dialogRef: MatDialogRef<any> = this.dialog.open(BankpopupComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data }
   
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        if (isNew) {
      
          this.loader.open('Adding new Bank');
          this.Service.addItem(res)
            .subscribe((data :any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Bank Added!', 'OK', { duration: 2000 });
              console.log("succed")
              this.getItems();
              this.getItemss()
            })
        } else {
          this.loader.open('Updating Bank');
          this.Service.updateItem(data.bankId,res)
            .subscribe((data:any) => {
              this.dataSource = data ;
              this.loader.close();
              this.snack.open('Bank Updated!', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }
  openPopUpbin(bank?: any, data?: any, isNew?) {
    let title = isNew ? 'Add new Bin' : 'Update Bin';
    let dialogRef: MatDialogRef<any> = this.dialog.open(BinpopupComponent, {
        width: '720px',
        disableClose: true,
        data: { title: title, payload: data }
    });

    dialogRef.afterClosed().subscribe(res => {
        if (!res) {
            // If user presses cancel or closes the dialog
            return;
        }

        this.loader.open(isNew ? 'Adding new Bin for ' + bank.bankName : 'Updating Bin ' + bank.bankName);

        setTimeout(() => {
            if (isNew) {
                this.Service.createBin(res, bank.bankName).subscribe((response: any) => {
                    this.dataSource3 = response;
                    this.loader.close();
                    this.snack.open('Bin Added!', 'OK', { duration: 2000 });
                    this.getItemss();
                    this.panelStates[bank.bankId] = true;
                    this.showWarningMessage(); // Call the function to display the warning message
                    
                });
            } else {
                this.Service.updateBin(data.binId, res).subscribe((response: any) => {
                    this.dataSource3 = response;
                    this.loader.close();
                    this.snack.open('Bin Updated!', 'OK', { duration: 2000 });
                    this.getItemss();
                    this.panelStates[bank.bankId] = true;
                    this.showWarningMessage(); // Call the function to display the warning message
                });
            }
        });
    });
}

showWarningMessage() {
    // Display a warning message to remind the user to configure the bin
    this.snack.open('Don\'t forget to configure your bin!', 'OK', { duration: 5000 });
}

deleteItembin(data) {
  this.confirmService.confirm({ message: `Delete Bin Value ${data.binValue}?` })
      .subscribe(confirm => {
          if (confirm) {
              this.loader.open('Deleting Item');
              this.Service.deleteBin(data.binId) // Assuming 'id' is the identifier for the item
                  .subscribe(() => {
                      this.loader.close();
                      this.snack.open('Item Deleted!', 'OK', { duration: 2000 });
                      this.getItemss()
                  
                  }, error => {
                      this.loader.close();
                      this.snack.open('Error deleting item.', 'OK', { duration: 2000 });
                      console.error(error); // Handle the error appropriately
                      this.getItemss()
                  });
          }
      });
}

openPopUpconf(data1: any, isNew?) {
  let title = isNew ? 'Add new Config' : 'Update Config';
  
  if (!isNew && data1 && data1.binId) {
    this.loader.open('Fetching Config Data');
    this.Service.getConfigureDataByBinId(data1.binId).subscribe((response: any) => {
      this.loader.close();
      let configData = response; // Assuming response contains the configuration data
      let dialogRef: MatDialogRef<ConfigurationComponent> = this.dialog.open(ConfigurationComponent, {
        width: '720px',
        disableClose: true,
        data: { title: title, payload: configData },
      });
  
      dialogRef.afterClosed().subscribe(formData => {
        if (!formData) {
          return;
        }
     
        this.loader.open('Updating Config');
        this.Service.configureData(formData, data1.binId).subscribe((response: any) => {
          this.loader.close();
         
          this.snack.open('Config Updated!', 'OK', { duration: 2000 });
          this.getItems();
        }, error => {
          console.error(error);
          // Handle error
        });
      });
    }, error => {
      this.loader.close();
      console.error(error);
      // Handle error
    });
  } else {
    // For new configurations or if binId is not provided, simply open the dialog without fetching data
    let dialogRef: MatDialogRef<ConfigurationComponent> = this.dialog.open(ConfigurationComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: null },
    });
  
    dialogRef.afterClosed().subscribe(formData => {
      if (!formData) {
        return;
      }
  
      this.loader.open('Adding Config');
      // Assuming data1.binId is provided for new configurations
      this.Service.configureData(formData, data1.binId).subscribe((response: any) => {
        this.loader.close();
        this.snack.open('Config Added!', 'OK', { duration: 2000 });
        this.getItems();
      }, error => {
        console.error(error);
        // Handle error
      });
    });
  }
}


  

    
  
  deleteItem(row) {
   
    this.confirmService.confirm({message: `Delete ${row.bankname}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Deleting Bank');
          this.Service.deleteItem(row)
            .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('deleting Bank!', 'OK', { duration: 2000 });
              this.getItems();
              this.getItemss();
            })
        }
      })
  }

  applyFilter(event :Event){
    const FilterValue = (event.target as HTMLInputElement).value ;
     this.dataSource.filter = FilterValue.trim().toLowerCase();
 
 }

 openPopUpbagency(bank?: any, data?: any, isNew?) {
  let title = isNew ? 'Add new agency' : 'Update agency';
  let dialogRef: MatDialogRef<any> = this.dialog.open(AgencypopupComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data }
  });

  dialogRef.afterClosed().subscribe(res => {
      if (!res) {
          // If user presses cancel or closes the dialog
          return;
      }

      this.loader.open(isNew ? 'Adding new Bin for ' + bank.bankName : 'Updating Bin ' + bank.bankName);

      setTimeout(() => {
          if (isNew) {
              this.Service.createAgency(res, bank.bankName).subscribe((response: any) => {
                this.dataSource4=response
                  this.loader.close();
                  this.snack.open('Bin Added!', 'OK', { duration: 2000 });
                  this.getItemss();
                  this.panelStates[bank.bankId] = true;
                
              });
          } else {
              this.Service.updateAgency(data.agenceId, res).subscribe((response: any) => {
                this.dataSource4=response
                  this.loader.close();
                  this.snack.open('Bin Updated!', 'OK', { duration: 2000 });
                  this.getItemss();
                  this.panelStates[bank.bankId] = true;
                  
              });
          }
      });
  });
}


deleteItemagence(data) {
  this.confirmService.confirm({ message: `Delete ${data.agenceName}?` })
      .subscribe(confirm => {
          if (confirm) {
              this.loader.open('Deleting Item');
              this.Service.deleteAgency(data.agenceId) // Assuming 'id' is the identifier for the item
                  .subscribe(() => {
                    this.dataSource4 = data;
                      this.loader.close();
                      this.snack.open('Item Deleted!', 'OK', { duration: 2000 });
                  
                      this.getItemss()
                         
                      this.panelStates[data.bankId] = true;
                  
                  }, error => {
                      this.loader.close();
                      this.snack.open('Error deleting item.', 'OK', { duration: 2000 });
                      console.error(error); // Handle the error appropriately
                      this.getItemss()
                  });
          }
      });
}


openPopUpconfiguration(bank?: any, data?: any, isNew?) {
  const title = isNew ? 'Add new ConfigurationFTP' : 'Update ConfigurationFTP';
  const dialogRef: MatDialogRef<any> = this.dialog.open(ConfComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data }
  });

  dialogRef.afterClosed().subscribe(res => {
      if (!res) {
          // If user presses cancel or closes the dialog
          return;
      }

      this.loader.open(isNew ? 'Adding new configuration for ' + bank.bankName : 'Updating configuration ' + bank.bankName);

      setTimeout(() => {
          const serviceCall = isNew ? this.Service.createAndAssignFTPConfiguration(bank.bankId, res) : this.Service.updateFTPConfiguration(res.id, res);
          
          serviceCall.subscribe((response: any) => {
              this.dataSource5 = response;
              this.loader.close();
              const actionMessage = isNew ? 'Added' : 'Updated';
              this.snack.open('Configuration ' + actionMessage + '!', 'OK', { duration: 2000 });
              this.getItemss();
              this.panelStates[bank.bankId] = true;
          });
      });
  });
}

deleteIteconfigurationftp(data) {
  this.confirmService.confirm({ message: `Delete ${data.server}?` })
      .subscribe(confirm => {
          if (confirm) {
              this.loader.open('Deleting configurationft');
              this.Service.deleteFTPConfiguration(data.id) // Assuming 'id' is the identifier for the item
                  .subscribe(() => {
                    this.dataSource5 = data;
                      this.loader.close();
                      this.snack.open('configurationftp Deleted!', 'OK', { duration: 2000 });
                  
                      this.getItemss()
                         
                      this.panelStates[data.bankId] = true;
                  
                  }, error => {
                      this.loader.close();
                      this.snack.open('Error deleting configurationftp.', 'OK', { duration: 2000 });
                      console.error(error); // Handle the error appropriately
                      this.getItemss()
                  });
          }
      });
}



}