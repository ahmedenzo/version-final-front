import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { JwtAuthService } from "../services/auth/jwt-auth.service";
import { Router } from "@angular/router";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private jwtAuth: JwtAuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    var token = this.jwtAuth.token || this.jwtAuth.getJwtToken();

    var changedReq;

    if (token) {

      changedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        },
      });

    } else {

      changedReq = req;
      
    }
    return next.handle(changedReq);
  }
}