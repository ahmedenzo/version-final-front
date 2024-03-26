import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtAuthService } from '../services/auth/jwt-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private jwtAuth: JwtAuthService, private snack: MatSnackBar) {}
 
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.jwtAuth.getUser();
    const roles = JSON.parse(this.jwtAuth.getLocalStorage().getItem(this.jwtAuth.APP_Role)) || [];


    if (user && roles.includes('Admin_SMT')) {
      return true;
    } else {
      this.snack.open('You do not have access to this page!', 'OK');
      return false;
    }
  }
}


