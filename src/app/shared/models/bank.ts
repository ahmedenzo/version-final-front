export interface Bank {
    bankId?:number;
    bankName?: string;
    bankIdCode?:number;
    bankLocation?: string;
   countryCode?:number;
    contactEmail?:string;
    contactPhone?:number;
    mainOfficeAddress?:string;
    bankFTPConfig?: confftp;
    bins?: Bin[];
    data: any[]; 
    agencies: any[]; 
    ftp?: any[];

  
  }
 
  export interface confftp {
    id?:number;
    server?: string;
    port?:number;
    username?: string;
    password?:string;
    remotePath?:string;
   

    
  }
  export interface agence {
    agenceId?:number;
    agenceName?: string;
    agenceAdresse?:string;
    contactEmail?: string;
    contactPhone?:string;
    openingDate?:string;
    
  }
  export interface Bin {
    binId?:number;
    binValue?: string;
    expireRange?:string;
    moneyCode?: string;
    cardBrand?:string;
    cardType?:string;
    currency?:string;

    
  }

  export interface confftp {
    id?:number;
    server?: string;
    port?:number;
    username?: string;
    password?:string;
    remotePath?:string;
   

    
  }

  export interface AtmData {
    atmDataId?: number;
    lgth?: string;
    useLimit?: string;
    totalWithdrawalLimit?: string;
    offlineWithdrawalLimit?: string;
    totalCashAdvanceLimit?: string;
    offlineCashAdvanceLimit?: string;
    maximumDepositCreditAmount?: string;
    lastUsed?: string;
    issuerTransactionProfile?: string;
  }
  
  export interface EmvData {
    emvDataId?: number;
    segxLgth?: string;
    atcLimit?: string;
    sendCardBlock?: string;
    sendPutData?: string;
    velocityLimitsLowerConsecutiveLimit?: string;
    userField2?: string;
    dataTag?: string;
    sendPinUnblock?: string;
    sendPinChange?: string;
    pinSyncAct?: string;
    accessScriptMgmtSubSys?: string;
    issApplDataFmt?: string;
    actionTableIndex?: string;
  }
  
  export interface POSPBFXD {
    posPbfXdId?: number;
    segxLgth?: string;
    ttlFloat?: string;
    daysDelinq?: string;
    monthsActive?: string;
    cycle1?: string;
    cycle2?: string;
    cycle3?: string;
    unknown?: string;
    userFld2?: string;
  }
  
  export interface PosData {
    posDataId?: number;
    segxLgth?: string;
    totalPurchaseLimit?: string;
    offlinePurchaseLimit?: string;
    totalCashAdvanceLimit?: string;
    offlineCashAdvanceLimit?: string;
    totalWithdrawalLimit?: string;
    offlineWithdrawalLimit?: string;
    useLimit?: string;
    totalRefundCreditLimit?: string;
    offlineRefundCreditLimit?: string;
    reasonCode?: string;
    lastUsed?: string;
    userField2?: string;
    issuerTransactionProfile?: string;
  }
  
  export interface ConfigureDataRequest {
    atmData?: AtmData;
    emvData?: EmvData;
    posData?: PosData;
    pospbfxd?: POSPBFXD;
  }
  
  export interface SMTPCONF {
    id?: number;
    host: string;
    port: number;
    username: string;
    password: string;
    auth?: boolean; // Add auth property as optional
    starttls?: boolean; // Add starttls property as optional
  }
  