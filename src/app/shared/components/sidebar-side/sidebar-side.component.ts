import { Component, OnInit, OnDestroy, AfterViewInit, Input } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { ThemeService } from "../../services/theme.service";
import { Subscription } from "rxjs";
import { ILayoutConf, LayoutService } from "app/shared/services/layout.service";
import { JwtAuthService } from "app/shared/services/auth/jwt-auth.service";



@Component({
  selector: "app-sidebar-side",
  templateUrl: "./sidebar-side.component.html"
})
export class SidebarSideComponent implements OnInit, OnDestroy, AfterViewInit {
  
  imageUrl: any;
  public menuItems: any[];
  public hasIconTypeMenuItem: boolean;
  public iconTypeMenuTitle: string;
  private menuItemsSub: Subscription;
  public layoutConf: ILayoutConf;
  username:any
  role:any
  constructor(
    private navService: NavigationService,
    public themeService: ThemeService,
    private layout: LayoutService,
    public jwtAuth: JwtAuthService,
  
   

  ) {}

  ngOnInit() {
    this.username = this.jwtAuth.getUser();
    const storedRoles = localStorage.getItem('roles');
    if (storedRoles) {
      this.role=this.jwtAuth.roles;
      this.role = JSON.parse(storedRoles);
    } else {
      this.role = this.jwtAuth.roles;
    }


    

    this.iconTypeMenuTitle = this.navService.iconTypeMenuTitle;
    this.menuItemsSub = this.navService.menuItems$.subscribe(menuItem => {
      this.menuItems = menuItem;
      //Checks item list has any icon type.
      this.hasIconTypeMenuItem = !!this.menuItems.filter(
        item => item.type === "icon"
      ).length;
      
    });
    this.layoutConf = this.layout.layoutConf;
    this.iconTypeMenuTitle = this.navService.iconTypeMenuTitle;
    this.menuItemsSub = this.navService.menuItems$.subscribe(menuItem => {
      const userRoles = this.jwtAuth.roles; // Get user roles
      
      // Filter menu items based on user's roles
      this.menuItems = menuItem.filter(item => {
        // Check if the item has a 'role' property and if the user has at least one of those roles
        return !item.role || item.role.some(role => userRoles.includes(role));
      });
    
      // Filter submenu items based on user's roles
      this.menuItems.forEach(menuItem => {
        if (menuItem.sub) {
          menuItem.sub = menuItem.sub.filter(subItem => {
            return !subItem.role || subItem.role.some(role => userRoles.includes(role));
          });
        }
      });
        
      
    });
  
    this.layoutConf = this.layout.layoutConf;
  }
  ngAfterViewInit() {}
  ngOnDestroy() {
    if (this.menuItemsSub) {
      this.menuItemsSub.unsubscribe();
    }
  }
  toggleCollapse() {
    if (
      this.layoutConf.sidebarCompactToggle
    ) {
        this.layout.publishLayoutChange({
        sidebarCompactToggle: false
      });
    } else {
        this.layout.publishLayoutChange({
            // sidebarStyle: "compact",
            sidebarCompactToggle: true
          });
    }
  }


}