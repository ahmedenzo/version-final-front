export interface User {
  id?:number;
  username?: string;
  image?: string;
  fullname?: string;
  adresse?: string;
  website?: string;
  phone?: number;
  email?:string;
  token?:string;
  bank?:string
  roles?: string[];

}



export enum Erole {
  Admin_Agence = 'Admin_Agence',
  Simple_User = 'Simple_User',
  Admin_Bank = 'Admin_Bank',
  Admin_SMT = 'Admin_SMT', 
}