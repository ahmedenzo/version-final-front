import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Bank,agence } from 'app/shared/models/bank';
import { User } from 'app/shared/models/user.model';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent implements OnInit {
  public itemForm: FormGroup;
  public getItemSub: Subscription;
  public banks: Bank[] = [];
  public agency: agence[] = [];
  roles: string[] = [];
  userr:any
  bankname: any
  user: Observable<User>;
  username :any
  banknames:string
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopUpComponent>,
    private fb: FormBuilder,
    public jwtAuth: JwtAuthService,

  ) {}

  ngOnInit(): void {
    const storedRoles = localStorage.getItem('roles');
    if (storedRoles) {
      this.roles = this.jwtAuth.roles;
      this.roles = JSON.parse(storedRoles);
    } else {
      // Set roles from JWT Auth service
      this.roles = this.jwtAuth.roles;
      // Store roles in Local Storage
      localStorage.setItem('roles', JSON.stringify(this.roles));
    }

    this.user = this.jwtAuth.user$;
    this.username = this.jwtAuth.getUser();
    this.buildItemForm(this.data.payload);
    this.getItemss();
    this.getBankAndAgency();
  }

  buildItemForm(item): void {
    this.itemForm = this.fb.group({
      username: [item.username || '', Validators.required],
      email: [item.email || '', Validators.required],
      password: [item.password || '', Validators.required],
      bankName: [item.bankName || '', Validators.required],
      agenceName: [item.agenceName || '', Validators.required]
    });
  }

  submit(): void {
    this.dialogRef.close(this.itemForm.value);
  }

  getItemss(): void {
    this.getItemSub = this.jwtAuth.getItemsbanks().subscribe((data: any) => {
      this.banks = data.map((bank: any) => {
        return {
          bankId: bank.bankId,
          bankName: bank.bankName,
          data: [],
          agencies: []
        };
      });
      this.banks.forEach((bank, index) => {
        this.jwtAuth.getAgenciesByBank(bank.bankName).subscribe((agencies: any) => {
          this.banks[index].agencies = agencies;
        });
      });
    });
  }

  getBankAndAgency() {
    this.jwtAuth.getBankNameByUsername(this.username).subscribe((response: any) => {
      this.banknames = response.bankname;
      this.jwtAuth.getAgenciesByBank(this.banknames).subscribe((agencies: any) => {
        this.agency = agencies;
      });
    });
  }
}