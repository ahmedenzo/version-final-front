import { Injectable } from "@angular/core";
import { LocalStoreService } from "../local-store.service";
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { map, catchError, delay, switchMap } from "rxjs/operators";
import { Erole, User} from "../../models/user.model";
import { of, BehaviorSubject, throwError, Observable, Subject } from "rxjs";
import { environment } from "environments/environment.prod";

import { ApiResponse } from "./ApiResponse ";
import { Bank, agence } from "app/shared/models/bank";


@Injectable({
  providedIn: "root",
})
export class JwtAuthService {
  token;
  userActivityTimeout: number = 40000;
   lastActivityTime: number;
    countdown: number; // New property to store the countdown value
  interval: any;
  roles : any 
  isAuthenticated: Boolean;
  user: User = {};
  user$ = (new BehaviorSubject<User>(this.user));
  signingIn: Boolean;
  baseUrl =environment.port+"/api/auth";
  private apiUrl = environment.port+'/api/auth/banks';
  private apiUrlagence = environment.port+'/api/auth/agencies';

  return: string;
  JWT_TOKEN = "JWT_TOKEN";
  JWT_RTOKEN = "RJWT_TOKEN";
  APP_USER = "UserName";
  APP_Role = "Role_USER";
  private secretKey = 'bezKoderSecretKey';
  refreshTokenInProgress: boolean = false;
  refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
 tokenExpirationSubject: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + this.getJwtToken()
    })
  };



  constructor(
    private ls: LocalStoreService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams
      .subscribe(params => this.return = params['return'] || '/');
      this.initUserActivityDetection();
      

  }

  getAllRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/roles`)
  }





  isLoggedIn(): Boolean {
    return !!this.getJwtToken();
  }



  getJwtToken() {
    return this.ls.getItem(this.JWT_TOKEN);
  }
  getUser() {
    return this.ls.getItem(this.APP_USER);
  }

  getrole() {
    return this.ls.getItem(this.APP_Role);
  }
  public signin(username, password): Observable<any> {
    this.signingIn = true;
    const url = `${this.baseUrl}/signin`;
    return this.http.post(url, { username, password })
      .pipe(
        map((res: any) => {
         
          this.setUserAndToken(res.token, res.email, !res, res.roles);
          this.signingIn = false;
          return res;
        }),
        catchError((error: any) => {
          alert(error.error.message);
          this.signingIn = false;
          return throwError(error);
        })
      );
  }
  completeProfile(completProfileRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/completeProfile`, completProfileRequest);
  }

  getItemsbanks(): Observable<Bank[]> {
    return this.http.get<Bank[]>(`${this.apiUrl}`).pipe(
      catchError(this.handleError)
    );
  }
  getBankNameByUsername(username: string): Observable<any> {
    const url = `${this.baseUrl}/Admin/${username}`;
    return this.http.get<any>(url);
  }
  getAgenciesByBank(bankName: string): Observable<agence[]> {
    const url = `${this.apiUrlagence}/by-bank/${bankName}`;
    return this.http.get<agence[]>(url);
  }
  getUserRoles(): string[] {
    return this.roles;
  }
  setUserAndToken(token: string, user: User, isAuthenticated: Boolean, roles: string[]) {
    this.isAuthenticated = isAuthenticated; 
    this.token = token;
    this.user = user;
    this.roles = roles;
  
    this.user$.next(user);
    this.ls.setItem(this.JWT_TOKEN, token);
    this.ls.setItem(this.APP_USER, user);
    this.ls.setItem(this.APP_Role, JSON.stringify(roles));
    
  }
  private clearLocalStorage(): void {
    this.ls.clear();
  }

  getRefreshToken(): string {
    return this.ls.getItem(this.JWT_RTOKEN);
  }
  registerAgentUser(agenceName: string, signupRequest: any, adminId: number): Observable<any> {
    const url = `${this.baseUrl}/signup/${agenceName}/Agentbank?Adminid=${adminId}`;
    return this.http.post(url, signupRequest);
  }
  

  updateCustomerRole(customerId: number, roleName: string): Observable<ApiResponse> {
    const url = `${this.baseUrl}/Updateid/${customerId}/role?roleName=${roleName}`;
    const token = localStorage.getItem('JWT_TOKEN');
    const headers = { Authorization: `Bearer ${token}` };
   
    return this.http.put<ApiResponse>(url, null, { headers });
  }


  changePassword(oldPassword: string, newPassword: string, confirmPassword: string): Observable<string> {
    const authToken = localStorage.getItem('JWT_TOKEN');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    // Prepare the data as URL encoded form data
    const body = `oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}&confirmPassword=${encodeURIComponent(confirmPassword)}`;

    return this.http.post<any>(`${this.baseUrl}/change-password`, body, { headers: headers, observe: 'response' })
      .pipe(
        map((response: HttpResponse<any>) => {
          // Extract the message from the response body
          const message = response.body?.message;
          if (message === 'Old password is incorrect') {
            throw new Error('Old password is incorrect');
          } else if (message === 'Password changed successfully') {
            return message;
          } else {
            throw new Error('Unknown response message');
          }
        }),
        catchError(err => {
          console.error('Error changing password:', err);
          if (err.message === 'Old password is incorrect') {
            return throwError(() => 'Old password is incorrect');
          } else if (err.message === 'Unknown response message') {
            return throwError(() => 'Unknown response message');
          } else {
            return throwError(() => 'Error changing password');
          }
        })
      );
  }
  
  
  



  getAllCustomersForUser(): Observable<any> {
    const url = `${this.baseUrl}/Admins`;
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
  getAllCustomersForUsers(userId: number): Observable<any> {
    const url = `${this.baseUrl}/${userId}/customers`;
    return this.http.get<any>(url);
  }
  
  getUserByUsername(username: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${username}`);
  }

 


  registerCustomerUser(signupRequest: any, bankname: any): Observable<any> {
    const body = {
      username: signupRequest.username,
      email: signupRequest.email,
      password: signupRequest.password
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    const params = { bankname: bankname };
  
    return this.http.post(`${this.baseUrl}/signup/adminbank`, body, { headers, params });
  }



  deleteCustomer(userId: number, customerId: number): Observable<any> {
    const url = `${this.baseUrl}/${userId}/customers/${customerId}`;
    return this.http.delete(url);
  }


   initUserActivityDetection() {
    this.lastActivityTime = Date.now();

    // Add event listeners to track user activity and cursor movement
    document.addEventListener("mousemove", this.onUserActivity);
    document.addEventListener("keydown", this.onUserActivity);
  }

  // Method to reset the countdown when there is user activity
  onUserActivity = () => {
    this.lastActivityTime = Date.now();
    this.resetCountdown();
  }

  // Method to reset the countdown
 resetCountdown() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.startCountdown();
  }

  // Helper function to start the countdown
 startCountdown() {
    this.countdown = this.userActivityTimeout / 1000;
    this.interval = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 1) {
        console.log('Token is about to expire!');
        // Emit the token expiration event using the Subject
        this.tokenExpirationSubject.next();
      }

      if (this.countdown <= 0) {
        // Token expired, clear the interval and sign out the user
        clearInterval(this.interval);
        this.signout();
      }
    }, 1000);
  }
  onTokenExpiry() {
    return this.tokenExpirationSubject.asObservable();
  }

  // Method called when the user performs an activity
 updateUserActivity() {
    this.lastActivityTime = Date.now();
    // Start the countdown only if the user is authenticated and no previous countdown is running
    if (this.isAuthenticated && !this.interval) {
      this.startCountdown();
    }
  }
    // Method to check if the token is expired
    isTokenExpired(): boolean {
      const tokenExpirationThresholdInSeconds = 10;
     
  
      // Check if the user has any activity
      if (this.isAuthenticated && this.lastActivityTime) {
        // Calculate the time difference between now and the last activity time
        const currentTime = Date.now();
        const timeDifferenceInSeconds = Math.floor((currentTime - this.lastActivityTime) / 1000);
  
        // Log the time difference
      
  
        // If the time difference is greater than the token expiration threshold,
        // sign out the user and return true (token expired)
        if (timeDifferenceInSeconds > tokenExpirationThresholdInSeconds) {
          this.signout();

          return true;
        }
      }
  
      // If the user has activity, reset the countdown and start it again
      this.updateUserActivity();
  
      return false;
    }
  
    // Existing properties and methods...
  


  
  public signout(): Observable<any> {
    this.clearLocalStorage();
    localStorage.removeItem('roles');
    this.isAuthenticated = false; // Mark the user as signed out

  
    this.router.navigateByUrl('sessions/signin');
    return this.http.post<any>(`${this.baseUrl}/signout`, null);
  }
  





  public getLocalStorage(): LocalStoreService {
    return this.ls;
  }
  
  getImage(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}/image`, { responseType: 'blob' });
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }




  resetPassword(passwordResetToken: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('passwordResetToken', passwordResetToken)
      .set('password', password);
    return this.http.post(`${this.baseUrl}/reset-password`, null, { params });
  }




  uploadImage(userId: number, file: File): Observable<number> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const req = new HttpRequest('POST', `${this.baseUrl}/${userId}/image`, formData, {
      reportProgress: true
    });

    return this.http.request(req).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round((100 * event.loaded) / event.total);
          return percentDone;
        } else if (event instanceof HttpResponse) {
          return 100;
        }
      })
    );
  }
  
  forgotPassword(email: string): Observable<any> {
    const url = `${this.baseUrl}/forgot-password?email=${email}`;
    return this.http.post(url, {});
   
  }


}