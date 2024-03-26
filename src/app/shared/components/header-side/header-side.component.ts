import { Component, OnInit, Input, ViewChildren } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { JwtAuthService } from '../../services/auth/jwt-auth.service';
import { EgretNotifications2Component } from '../egret-notifications2/egret-notifications2.component';
import { Notifications2Service } from '../egret-notifications2/notifications2.service';

@Component({
  selector: 'app-header-side',
  templateUrl: './header-side.template.html'
})
export class HeaderSideComponent implements OnInit {
  @Input() notificPanel;
  public notificationCount: number = 0;
  @ViewChildren(EgretNotifications2Component) noti;
  roles: string[] = [];
  public availableLangs = [
    { name: 'EN', code: 'en', flag: 'us' },
   
 
   
  ];
  
  currentLang = this.availableLangs[0];
  public egretThemes;
  public layoutConf: any;

  constructor(
    private themeService: ThemeService,
    private layout: LayoutService,
    public translate: TranslateService,
    public jwtAuth: JwtAuthService,
    private Notifications2Service: Notifications2Service
  ) {}

  ngOnInit() {
    const storedRoles = localStorage.getItem('roles');
    if (storedRoles) {
      this.roles = JSON.parse(storedRoles);
    } else {
      // Set roles from JWT Auth service
      this.roles = this.jwtAuth.roles;
      // Store roles in Local Storage
      localStorage.setItem('roles', JSON.stringify(this.roles));
    }
  
    this.egretThemes = this.themeService.egretThemes;
    this.layoutConf = this.layout.layoutConf;
    this.translate.use(this.currentLang.code);
  
    this.Notifications2Service.notificationCount$.subscribe(count => {
      this.notificationCount = count;
      console.log("Received notification count:", this.notificationCount);
      this.Notifications2Service.updateCount;
    });
  
    // Check if the user has the 'Admin_SMT' role and set the sidebar style accordingly
    const isAdminSMT = this.roles.includes('Admin_SMT');
    if (isAdminSMT) {
      this.layout.publishLayoutChange({
        sidebarStyle: 'closed'
      });
    }
  }
  
  toggleSidenav() {
    if (this.layoutConf.sidebarStyle === 'closed') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full'
      });
    }
    this.layout.publishLayoutChange({
      sidebarStyle: 'closed'
    });
  }
  
  setLang(lng) {
    this.currentLang = lng;
    this.translate.use(lng.code);
  }

  toggleNotific() {
    this.notificPanel.toggle();
  }

 

  toggleCollapse() {
    if (this.layoutConf.sidebarStyle === 'compact') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full',
        sidebarCompactToggle: false
      }, { transitionClass: true });
    }
    this.layout.publishLayoutChange({
      sidebarStyle: 'compact',
      sidebarCompactToggle: true
    }, { transitionClass: true });
  }
}
