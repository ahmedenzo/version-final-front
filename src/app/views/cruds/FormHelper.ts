import { updatecode, CardProcessIndicator, ACS, Sourcecode, PKIiNDICATOR, TerritoryCode, RenewOption,CardStatus } from "app/shared/models/Cardholder";

export function reverseUpdateCode(value: string): updatecode {
  switch (value) {
    case "1":
      return updatecode.Card_First_Creation;
    case "2":
      return updatecode.Card_Update;
    case "3":
      return updatecode.Card_Cancellation;
    case "4":
      return updatecode.Card_Renewal;
    default:
      return updatecode.Card_First_Creation; 
  }
}

export function reverseCardProcessIndicator(value: string): CardProcessIndicator {
  switch (value) {
    case 'C':
      return CardProcessIndicator.Pin_Mailer_Reminder;
    case 'P':
      return CardProcessIndicator.Pin_Offset_Update;
    case 'D':
      return CardProcessIndicator.Card_Perso_And_Pin_Mailer_Print;
    case 'F':
      return CardProcessIndicator.Personalization_Only;
    case 'N':
      return CardProcessIndicator.Card_Cancellation;
    case 'V':
      return CardProcessIndicator.CVV2_Mailer_Reminder;
    default:
      return CardProcessIndicator.Any_Other_Updated_Field;
  }
}

export function reverseACS(value: string): ACS {
  switch (value) {
    case 'E':
      return ACS.TO_ENROLL_IN_ACS;
    case 'M':
      return ACS.Modification;
    case 'C':
      return ACS.ACS_Code_Reminder;
    case 'S':
      return ACS.ACS_Deletion;
    default:
      return ACS.TO_NOT_ENROLL_IN_ACS;
  }
}

export function reverseSourceCode(value: string): Sourcecode {
  switch (value) {
    case "1":
      return Sourcecode.Individual;
    case "2":
      return Sourcecode.BankStaff;
    case "3":
      return Sourcecode.Corporate;
    default:
      return Sourcecode.Individual; 
  }
}

export function reversePKIIndicator(value: string): PKIiNDICATOR {
  switch (value) {
    case "0":
      return PKIiNDICATOR.PKI_CARD;
    case "1":
      return PKIiNDICATOR.NOT_PKI_CARD;
    default:
      return PKIiNDICATOR.PKI_CARD; 
  }
}

export function reverseTerritoryCode(value: string): TerritoryCode {
  switch (value) {
    case "2":
      return TerritoryCode.International;
    case "1":
      return TerritoryCode.National;
    default:
      return TerritoryCode.International; 
  }
}

export function reverseRenewOption(value: string): RenewOption {
  switch (value) {
    case "0":
      return RenewOption.To_Be_Renewed_After_Expiration;
    case "1":
      return RenewOption.Not_To_Be_Renewed;
    default:
      return RenewOption.Not_To_Be_Renewed; 
  }
}

  export function reverseOption(value: string): CardStatus {
    switch (value) {
      case "0":
        return CardStatus.Issued_But_Not_Active;
      case "1":
        return CardStatus.Open;
        case "2":
          return CardStatus.Lost_Card;
          case "3":
            return CardStatus.Stolen_Card;
            case "4":
              return CardStatus.Restricted;
              case "5":
                return CardStatus.VIP;
                case "6":
                  return CardStatus.Check_Reason_Code;
                  case "9":
                    return CardStatus.Closed;
                    case "A":
                      return CardStatus.Referral;
                      case "B":
                        return CardStatus.Maybe;
                        case "C":
                          return CardStatus.Denail;
                          case "D":
                            return CardStatus.Signature_Required;
                            case "E":
                              return CardStatus.Country_Club;
                              case "F":
                                return CardStatus.Expired_Card;
                                case "G":
                                  return CardStatus.Commercial;

    }
  




  
}

