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
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ConfigurationComponent>,
  private fb: FormBuilder,public jwtAuth: JwtAuthService, ) { }

ngOnInit(): void {
  if (this.data.payload) {
    this.buildItemForm(this.data.payload);
    console.log(this.data.payload);
  } else {
    console.error("Payload is undefined or null.");
  }
}


  buildItemForm(item): void {
   
    this.itemForm1 = this.fb.group({
      lgth: [item.configuredAtmData?.lgth || '0088', Validators.required],
      useLimit: [item.configuredAtmData?.useLimit || '0025', Validators.required],
      totalWithdrawalLimit: [item.configuredAtmData?.totalWithdrawalLimit || '100000', Validators.required],
      offlineWithdrawalLimit: [item.configuredAtmData?.offlineWithdrawalLimit || '50000', Validators.required],
      totalCashAdvanceLimit: [item.configuredAtmData?.totalCashAdvanceLimit || '5000', Validators.required],
      offlineCashAdvanceLimit: [item.configuredAtmData?.offlineCashAdvanceLimit || '2000' , Validators.required],
      maximumDepositCreditAmount: [item.configuredAtmData?.maximumDepositCreditAmount || '0000000000', Validators.required],
      lastUsed: [item.configuredAtmData?.lastUsed || '000000', Validators.required],
      issuerTransactionProfile: [item.configuredAtmData?.issuerTransactionProfile || 'ATM', Validators.required],
  });

  this.itemForm2 = this.fb.group({
      segxLgth: [item.configuredEmvData?.segxLgth || '1234', Validators.required],
      atcLimit: [item.configuredEmvData?.atcLimit || '5678', Validators.required],
      sendCardBlock: [item.configuredEmvData?.sendCardBlock || 'Yes', Validators.required],
      sendPutData: [item.configuredEmvData?.sendPutData || 'No', Validators.required],
      velocityLimitsLowerConsecutiveLimit: [item.configuredEmvData?.velocityLimitsLowerConsecutiveLimit  || '1000', Validators.required],
      userField2: [item.configuredEmvData?.userField2 || '', Validators.required],
      dataTag: [item.configuredEmvData?.dataTag || '', Validators.required],
      sendPinUnblock: [item.configuredEmvData?.sendPinUnblock || 'Yes', Validators.required],
      sendPinChange: [item.configuredEmvData?.sendPinChange || 'No', Validators.required],
      pinSyncAct: [item.configuredEmvData?.pinSyncAct || 'Sync', Validators.required],
      accessScriptMgmtSubSys: [item.configuredEmvData?.accessScriptMgmtSubSys || 'System123', Validators.required],
      issApplDataFmt: [item.configuredEmvData?.issApplDataFmt || 'FormatA', Validators.required],
      actionTableIndex: [item.configuredEmvData?.actionTableIndex || 'Index123', Validators.required],
  });

       this.itemForm3 = this.fb.group({
  segxLgth: [item.configuredPOSPBFXD?.segxLgth || '0042', Validators.required],
  ttlFloat: [item.configuredPOSPBFXD?.ttlFloat || '000000000000000', Validators.required],
  daysDelinq: [item.configuredPOSPBFXD?.daysDelinq || '00', Validators.required],
  monthsActive: [item.configuredPOSPBFXD?.monthsActive || '00', Validators.required],
  cycle1: [item.configuredPOSPBFXD?.cycle1 || '00', Validators.required],
  cycle2: [item.configuredPOSPBFXD?.cycle2 || '00', Validators.required],
  cycle3: [item.configuredPOSPBFXD?.cycle3 || '00', Validators.required],
  unknown: [item.configuredPOSPBFXD?.unknown || '000000000000', Validators.required],
  userFld2: [item.configuredPOSPBFXD?.userFld2 || '', Validators.required],
});

this.itemForm4 = this.fb.group({
  segxLgth: [item.configuredPosData?.segxLgth || '0140000000000000', Validators.required],
  totalPurchaseLimit: [item.configuredPosData?.totalPurchaseLimit || '000000001000', Validators.required],
  offlinePurchaseLimit: [item.configuredPosData?.offlinePurchaseLimit || '000000001000', Validators.required],
  totalCashAdvanceLimit: [item.configuredPosData?.totalCashAdvanceLimit || '000000001000', Validators.required],
  offlineCashAdvanceLimit: [item.configuredPosData?.offlineCashAdvanceLimit || '000000001000', Validators.required],
  totalWithdrawalLimit: [item.configuredPosData?.totalWithdrawalLimit  || '000000001000', Validators.required],
  offlineWithdrawalLimit: [item.configuredPosData?.offlineWithdrawalLimit  || '000000001000', Validators.required],
  useLimit: [item.configuredPosData?.useLimit|| '0025' , Validators.required],
  totalRefundCreditLimit: [item.configuredPosData?.totalRefundCreditLimit || '000000001000', Validators.required],
  offlineRefundCreditLimit: [item.configuredPosData?.offlineRefundCreditLimit || '000000001000', Validators.required],
  reasonCode: [item.configuredPosData?.reasonCode || '', Validators.required],
  lastUsed: [item.configuredPosData?.lastUsed || '', Validators.required],
  userField2: [item.configuredPosData?.userField2 || '', Validators.required],
  issuerTransactionProfile: [item.configuredPosData?.issuerTransactionProfile || 'POS', Validators.required],
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
     
      totalPurchaseLimit: this.itemForm4.value.totalPurchaseLimit,
      offlinePurchaseLimit: this.itemForm4.value.offlinePurchaseLimit,
      totalCashAdvanceLimit: this.itemForm4.value.totalCashAdvanceLimit,
      offlineCashAdvanceLimit: this.itemForm4.value.offlineCashAdvanceLimit,
      totalWithdrawalLimit: this.itemForm4.value.totalWithdrawalLimit,
      offlineWithdrawalLimit: this.itemForm4.value.offlineWithdrawalLimit,
      useLimit: this.itemForm4.value.useLimit,
      totalRefundCreditLimit: this.itemForm4.value.totalRefundCreditLimit,
      offlineRefundCreditLimit: this.itemForm4.value.offlineRefundCreditLimit,
      reasonCode: this.itemForm4.value.reasonCode,
      lastUsed: this.itemForm4.value.lastUsed,
      issuerTransactionProfile: this.itemForm4.value.issuerTransactionProfile,
    };
  
    const pospbfxd = {
      segxLgth: this.itemForm3.value.segxLgth,
      ttlFloat: this.itemForm3.value.ttlFloat,
      daysDelinq: this.itemForm3.value.daysDelinq,
      monthsActive: this.itemForm3.value.monthsActive,
      cycle1: this.itemForm3.value.cycle1,
      cycle2: this.itemForm3.value.cycle2,
      cycle3: this.itemForm3.value.cycle3,
      unknown: this.itemForm3.value.unknown,
      userFld2: this.itemForm3.value.userFld2,
    };

  
    // Get the form values


    // Create the form data object
    const formData = {
      atmData: atmData,
      emvData: emvData,
      posData: posData,
      pospbfxd: pospbfxd,
    };

    // Close the dialog with the form data
    this.dialogRef.close(formData);

  }
  
 
}