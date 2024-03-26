import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Get user's roles from localStorage or from your authentication service
    const roles: string[] = ['Admin_SMT', 'Admin_Bank', 'Simple_User', 'Admin_Agence'];

    // Check if the route has required roles specified
    const requiredRoles = route.data?.roles as string[];
    if (!requiredRoles || requiredRoles.length === 0) {
      // No specific roles required, allow access
      return true;
    }

    // Check if the user's role matches any of the required roles for the route
    const hasPermission = requiredRoles.some(role => roles.includes(role));
    if (!hasPermission) {
      // User does not have required roles, redirect to unauthorized page or handle accordingly
      this.router.navigate(['/sessions/404']);
      return false;
    }

    return true;
  }
}
