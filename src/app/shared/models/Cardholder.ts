export interface CardHolder {
  

    renewOption?: RenewOption,
    updatecode?: updatecode,
    cardProcessIndicator?: CardProcessIndicator,
    sourcecode?: Sourcecode
    pkiindicator?: PKIiNDICATOR
    acs?: ACS
    territorycode?: TerritoryCode
    date1?: string;
    date2?: string;
    cardholderNumber?: number;
    customerId?: any;
    createdAt?: any;
    cardtype?: any;
    createdBy?: any;
    primarycardcode?: any;
    Card ?: any;
    updatedBy?: any;
    updatedAt?: any;
    bin?: any;
    countryCode?: any;
    cityCode?: any;
    bankIdCode?: any;
    pinoffset?: any;
    operatorUserCode?: any;
    julianDate?: any;
  
    confirmation?: any;
  
    freesCode?: any;
    firstAccount?: number;
    secondAccount?: any;
    birthDate?: any;
    countryPhonecode:any
    branchcode?: number;
    address?: string;
    addresstwo?: string;
    addressthree?: string;
    corporateName?: string;
    currencycode?: number;
    name?: string;
    postalCode?: number;
    cin?: number;
    passportId?: number;
    phoneNumber?: number;
    email?: string;
    statuscard ?: string;
    cardgenerated?:  boolean
 }

export enum RenewOption {

    To_Be_Renewed_After_Expiration ="To_Be_Renewed_After_Expiration",
    Not_To_Be_Renewed ="Not_To_Be_Renewed"

}



export enum updatecode {
    Card_First_Creation = "Card_First_Creation",
    Card_Update = "Card_Update",
    Card_Cancellation = "Card_Cancellation",
    Card_Renewal = "Card_Renewal",
  }
  export enum Sourcecode {
    Individual = "Individual",
    BankStaff = "BankStaff",
    Corporate = "Corporate",
   
  }

  export enum PKIiNDICATOR {
    PKI_CARD = "PKI_CARD",
    NOT_PKI_CARD = "NOT_PKI_CARD",

   
  }

  export enum ACS {
    TO_NOT_ENROLL_IN_ACS = "TO_NOT_ENROLL_IN_ACS",
    TO_ENROLL_IN_ACS = "TO_ENROLL_IN_ACS",
    Modification = "Modification",
    ACS_Code_Reminder = "ACS_Code_Reminder",
    ACS_Deletion = "ACS_Deletion",

   
  }


export enum CardProcessIndicator {
   
    Pin_Mailer_Reminder ="Pin_Mailer_Reminder",
    Card_Perso_And_Pin_Mailer_Print ="Card_Perso_And_Pin_Mailer_Print",
    Personalization_Only ="Personalization_Only",
    Card_Cancellation ="Card_Cancellation",
    Pin_Offset_Update ="Pin_Offset_Update",
    CVV2_Mailer_Reminder ="CVV2_Mailer_Reminder",
    Any_Other_Updated_Field ="Any_Other_Updated_Field",

}

export enum TerritoryCode {

    National ="National",
    International ="International",


}

export enum CardStatus {
   
  Issued_But_Not_Active ="Issued_But_Not_Active",
  Open ="Open",
  Lost_Card ="Lost_Card",
  Stolen_Card ="Stolen_Card",
  Restricted ="Restricted",
  VIP ="VIP",
  Check_Reason_Code ="Check_Reason_Code",
  Closed ="Closed",
  Referral ="Referral",
  Maybe ="Maybe",
  Denail ="Denail",
  Signature_Required ="Signature_Required",
  Country_Club ="Country_Club",
  Expired_Card ="Expired_Card",
  Commercial ="Commercial",

}

export interface CAFApplicationDataRecord {
  id: number;
  cfagenerated: boolean;
  count: string;
  lgth: string;
  pan: string;
  MbrNum: string;
  recordType: string;
  cardType: string;
  fiid: string;
  cardStatus: string;
  pinOffset: string;
  totalWithdrawalLimit: string;
  offlineWithdrawalLimit: string;
  totalCashAdvanceLimit: string;
  offlineCashAdvanceLimit: string;
  aggregateLimit: string;
  offlineAggregateLimit: string;
  firstUsedDate: string;
  lastResetDate: string;
  cardExpDate: string;
  cardEffectiveDate: string;
  userField1: string;
  secondCardExpirationDate: string;
  secondCardEffectiveDate: string;
  secondCardStatus: string;
  userField2: string;
  userFieldACI: string;
  userFieldREGN: string;
  userFieldCUST: string;
  acctLgth: string;
  acctCnt: string;
  acctTyp: string;
  acctNum: string;
  acctStat: string;
  acctDescr: string;
  acctCorp: string;
  acctQual: string;
}

export interface pbf {
  id: number;
  pbfgenerated: boolean;
  Lgth: string;
  cnt: string;
  PrikeyFiid: string;
  numAccount: string;
  typ: string;
  AcctStat: string;
  recTyp: string;
  availBal: number;
  ledgBal: number;
  amtOnHld: string;
  ovrdrftLmt: string;
  lastDepDat: string;
  lastDepAmt: string;
  lastWdlDat: string;
  lastWdlAmt: string;
  crncyCde: string;
  userFld1: string;
  userFldAci: string;
  userFldRegn: string;
  userFldCust: string;
}

