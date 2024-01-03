import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  public itemForm1: FormGroup;
  public itemForm2: FormGroup;
  public itemForm3: FormGroup;
  public itemForm4: FormGroup;
 
  public  isLinear = false;
  constructor( @Inject(MAT_DIALOG_DATA) public data1: any,
  public dialogRef: MatDialogRef<ConfigurationComponent>,
  private fb: FormBuilder,public jwtAuth: JwtAuthService, ) { }

  ngOnInit(): void {
    
    this.buildItemForm(this.data1.payload);
    
  }

  buildItemForm(item): void {
   
        this.itemForm1 = this.fb.group({
       
          lgth: [item.lgth || '0042', Validators.required],
          useLimit: [item.useLimit || '50000', Validators.required],
          totalWithdrawalLimit: [item.totalWithdrawalLimit || '100000', Validators.required],
          offlineWithdrawalLimit: [item.offlineWithdrawalLimit || '50000', Validators.required],
          totalCashAdvanceLimit: [item.totalCashAdvanceLimit || '5000', Validators.required],
          offlineCashAdvanceLimit: [item.offlineCashAdvanceLimit || '2000', Validators.required],
          maximumDepositCreditAmount: [item.maximumDepositCreditAmount || '50000', Validators.required],
          lastUsed: [item.lastUsed || '', Validators.required],
          issuerTransactionProfile: [item.issuerTransactionProfile || 'Standard', Validators.required],
        });
   
        this.itemForm2 = this.fb.group({
        
          segxLgth: [item.segxLgth || '1234', Validators.required],
          atcLimit: [item.atcLimit || '5678', Validators.required],
          sendCardBlock: [item.sendCardBlock || 'Yes', Validators.required],
          sendPutData: [item.sendPutData || 'No', Validators.required],
          velocityLimitsLowerConsecutiveLimit: [item.velocityLimitsLowerConsecutiveLimit || '1000', Validators.required],
          userField2: [item.userField2 || 'SomeValue', Validators.required],
          dataTag: [item.dataTag || 'Tag123', Validators.required],
          sendPinUnblock: [item.sendPinUnblock || 'Yes', Validators.required],
          sendPinChange: [item.sendPinChange || 'No', Validators.required],
          pinSyncAct: [item.pinSyncAct || 'Sync', Validators.required],
          accessScriptMgmtSubSys: [item.accessScriptMgmtSubSys || 'System123', Validators.required],
          issApplDataFmt: [item.issApplDataFmt || 'FormatA', Validators.required],
          actionTableIndex: [item.actionTableIndex || 'Index123', Validators.required],
        });
     

        this.itemForm3 = this.fb.group({
        
         
          segxLgth: [item.segxLgth || '0300', Validators.required],
          ttlFloat: [item.ttlFloat || '12345', Validators.required],
          daysDelinq: [item.daysDelinq || '30', Validators.required],
          monthsActive: [item.monthsActive || '12', Validators.required],
          cycle1: [item.cycle1 || 'Cycle1Value', Validators.required],
          cycle2: [item.cycle2 || 'Cycle2Value', Validators.required],
          cycle3: [item.cycle3 || 'Cycle3Value', Validators.required],
          unknown: [item.unknown || 'UnknownValue', Validators.required],
          userFld2: [item.userFld2 || 'UserFld2Value', Validators.required],
        });

        this.itemForm4 = this.fb.group({
         
          segxLgth: [item.segxLgth || '0042', Validators.required],
          totalPurchaseLimit: [item.totalPurchaseLimit || '999999999999999', Validators.required],
          offlinePurchaseLimit: [item.offlinePurchaseLimit || '8888', Validators.required],
          totalCashAdvanceLimit: [item.totalCashAdvanceLimit || '7777', Validators.required],
          offlineCashAdvanceLimit: [item.offlineCashAdvanceLimit || '6666', Validators.required],
          totalWithdrawalLimit: [item.totalWithdrawalLimit || '5555', Validators.required],
          offlineWithdrawalLimit: [item.offlineWithdrawalLimit || '4444', Validators.required],
          useLimit: [item.useLimit || '3333', Validators.required],
          totalRefundCreditLimit: [item.totalRefundCreditLimit || '2222', Validators.required],
          offlineRefundCreditLimit: [item.offlineRefundCreditLimit || '1111', Validators.required],
          reasonCode: [item.reasonCode || 'Reason123', Validators.required],
          lastUsed: [item.lastUsed || 'LastUsedValue', Validators.required],
          userField2: [item.userField2 || '', Validators.required],
          issuerTransactionProfile: [item.issuerTransactionProfile || 'Profile123', Validators.required],
        });
 
    }
  
  toggleLinearMode(): void {
    this.isLinear = !this.isLinear;
  }
  submit() {
    const atmData = {
      lgth: this.itemForm1.value.lgth,
      useLimit: this.itemForm1.value.useLimit,
      totalWithdrawalLimit: this.itemForm1.value.totalWithdrawalLimit,
      offlineWithdrawalLimit: this.itemForm1.value.offlineWithdrawalLimit,
      totalCashAdvanceLimit: this.itemForm1.value.totalCashAdvanceLimit,
      offlineCashAdvanceLimit: this.itemForm1.value.offlineCashAdvanceLimit,
      maximumDepositCreditAmount: this.itemForm1.value.maximumDepositCreditAmount,
      lastUsed: this.itemForm1.value.lastUsed,
      issuerTransactionProfile: this.itemForm1.value.issuerTransactionProfile,
    };
  
    const emvData = {
      segxLgth: this.itemForm2.value.segxLgth,
      atcLimit: this.itemForm2.value.atcLimit,
      sendCardBlock: this.itemForm2.value.sendCardBlock,
      sendPutData: this.itemForm2.value.sendPutData,
      velocityLimitsLowerConsecutiveLimit: this.itemForm2.value.velocityLimitsLowerConsecutiveLimit,
      userField2: this.itemForm2.value.userField2,
      dataTag: this.itemForm2.value.dataTag,
      sendPinUnblock: this.itemForm2.value.sendPinUnblock,
      sendPinChange: this.itemForm2.value.sendPinChange,
      pinSyncAct: this.itemForm2.value.pinSyncAct,
      accessScriptMgmtSubSys: this.itemForm2.value.accessScriptMgmtSubSys,
      issApplDataFmt: this.itemForm2.value.issApplDataFmt,
      actionTableIndex: this.itemForm2.value.actionTableIndex,
    };
  
    const posData = {
      segxLgth: this.itemForm3.value.segxLgth,
      totalPurchaseLimit: this.itemForm3.value.totalPurchaseLimit,
      offlinePurchaseLimit: this.itemForm3.value.offlinePurchaseLimit,
      totalCashAdvanceLimit: this.itemForm3.value.totalCashAdvanceLimit,
      offlineCashAdvanceLimit: this.itemForm3.value.offlineCashAdvanceLimit,
      totalWithdrawalLimit: this.itemForm3.value.totalWithdrawalLimit,
      offlineWithdrawalLimit: this.itemForm3.value.offlineWithdrawalLimit,
      useLimit: this.itemForm3.value.useLimit,
      totalRefundCreditLimit: this.itemForm3.value.totalRefundCreditLimit,
      offlineRefundCreditLimit: this.itemForm3.value.offlineRefundCreditLimit,
      reasonCode: this.itemForm3.value.reasonCode,
      lastUsed: this.itemForm3.value.lastUsed,
      issuerTransactionProfile: this.itemForm3.value.issuerTransactionProfile,
    };
  
    const pospbfxd = {
      segxLgth: this.itemForm4.value.segxLgth,
      ttlFloat: this.itemForm4.value.ttlFloat,
      daysDelinq: this.itemForm4.value.daysDelinq,
      monthsActive: this.itemForm4.value.monthsActive,
      cycle1: this.itemForm4.value.cycle1,
      cycle2: this.itemForm4.value.cycle2,
      cycle3: this.itemForm4.value.cycle3,
      unknown: this.itemForm4.value.unknown,
      userFld2: this.itemForm4.value.userFld2,
    };
  
    const formData = {
      atmData: atmData,
      emvData: emvData,
      posData: posData,
      pospbfxd: pospbfxd,
    };
  
    this.dialogRef.close(formData);
  }
  
 
}