import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { JwtAuthService } from "../services/auth/jwt-auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private router: Router, private jwtAuth: JwtAuthService, private snack: MatSnackBar) {}
 
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.jwtAuth.getUser();
    const roles = JSON.parse(this.jwtAuth.getLocalStorage().getItem(this.jwtAuth.APP_Role)) || [];


    if (user && roles.includes('ROLE_Admin')) {
      return true;
    } else {
      this.snack.open('You do not have access to this page!', 'OK');
      return false;
    }
  }
}