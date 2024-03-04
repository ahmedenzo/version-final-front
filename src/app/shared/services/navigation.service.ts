import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtAuthService } from './auth/jwt-auth.service';


interface IMenuItem {
  type: 'link' | 'dropDown' | 'icon' | 'separator' | 'extLink';
  name?: string;
  state?: string;
  icon?: string;
  svgIcon?: string;
  tooltip?: string;
  disabled?: boolean;
  sub?: IChildItem[];
  badges?: IBadge[];
  role?: string[]; 
}
interface IChildItem {
  type?: string;
  name: string;
  state?: string;
  icon?: string;
  svgIcon?: string;
  sub?: IChildItem[];
  role?: string[]; 

}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

@Injectable()
export class NavigationService {
  
  roles: string[] = [];
  
  iconMenu: IMenuItem[] = [

    {
      name: 'PROFILE',
      type: 'dropDown',
      tooltip: 'Profile',
      icon: 'person',
      role: ['Admin_SMT','Admin_Bank','Simple_User','Admin_Agence'],    
      badges: [{ color: 'primary', value: '2' }],
      sub: [
      
        { name: 'Profile Settings', state: 'profile/settings', role: ['Admin_SMT','Admin_Bank','Simple_User','Admin_Agence'] }

      ]
 
    },
 

    {
      name: 'Card Management',
      type: 'dropDown',
      icon: 'list',
      role: ['Admin_Agence'],
      sub: [

     
        {name: 'Manage Cards Balance', state: 'pbfcard/pbf-class',       role: ['Admin_Agence']},
        {name: 'Manage Cards Status', state: 'cafcard/caf-class', role: ['Admin_Agence']},


     
      ]
    },
    {
      name: 'Card Management',
      type: 'dropDown',
      icon: 'list',
      role: ['Simple_User'],
      sub: [

        {name: 'Create New Card', state: 'create/create-card',role :['Simple_User']},
     
   
        {name: 'Update Card Operations', state: 'update/update-card', role: ['Simple_User']},

     
      ]
    },


    {
      name: 'Card Files Management',
      type: 'dropDown',
      icon: 'list',
      role: ['Admin_Bank'],
      sub: [
        {
          name: 'Generate Files',
          type: 'dropDown',
          role: ['Admin_Bank'],
          sub: [
            { name: 'Generate CardHolder File', state: 'gfile/generated-card', role: ['Admin_Bank'] },
            { name: 'Generate Cards Balance File', state: 'cafcard/generated-pbf' , role: ['Admin_Bank']},
            { name: 'Generate Cards Status File', state: 'cafgen/generated-caf', role: ['Admin_Bank'] },
          

          ]
        },
        {name: 'Files LIst', state: 'list/listefile',  role: ['Admin_Bank'],},
    
      ]
    },  

    {
      name: 'Card Files Management',
      type: 'dropDown',
      icon: 'list',
      role: ['Admin_SMT'],
      sub: [

        {name: 'Files LIst', state: 'list/listefile',  role: ['Admin_SMT'],},
    
      ]
    }, 

  ];

  iconTypeMenuTitle = 'Frequently Accessed';
 
  menuItems = new BehaviorSubject<IMenuItem[]>(this.iconMenu);

  menuItems$ = this.menuItems.asObservable();
  constructor(    private jwtAuthService: JwtAuthService,) { }

 publishNavigationChange(menuType: string) {
    switch (menuType) {

    }
  }
  
}
