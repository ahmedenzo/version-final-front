import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UserDB } from '../../shared/inmemory-db/users';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { CardHolder } from 'app/shared/models/Cardholder';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { Bin } from 'app/shared/models/bank';
import { environment } from 'environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class UpdateCardService {

  items: any[];
  private apiUrl = environment.port+'/api/auth/card';
  private apiUrlbin = environment.port+'/api/auth/bins';
  constructor(
    private http: HttpClient,
    private JwtAuthService :JwtAuthService
  ) {}

  //******* Implement your APIs ********
  getItems(): Observable<CardHolder[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),

    });
    return this.http.get<CardHolder[]>(`${this.apiUrl}/all`,{ headers }).pipe(
      catchError(this.handleError)
    );
  }
  getBinsByBank(bankName: string): Observable<any> {
    const url = `${this.apiUrlbin}/by-bank/${bankName}`;
    return this.http.get<any>(url);
  }

  getItem(id: number): Observable<CardHolder> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),
      'RefrechTokenV': this.JwtAuthService.getRefreshToken()
    });
    
    const url = `${this.apiUrl}/CardHolder/${id}`;
    return this.http.get<CardHolder>(url,{ headers }).pipe(
      catchError(this.handleError)
    );
  }
  updateCardHolderData(customerId: number, selectedBinId: number, updatedData: CardHolder): Observable<CardHolder> {
    const url = `${this.apiUrl}/${customerId}/Newoperation/${selectedBinId}`;
    
    return this.http.put<CardHolder>(url, updatedData);
  }
  
  updateItem(customerId: number ,CardHolder:any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),

    });
    const url = `${this.apiUrl}/update/${customerId}`;
    return this.http.put<any>(url,CardHolder,{ headers }).pipe(
      catchError(this.handleError)
    );
  }
 


  getConfirmedCardHolders(): Observable<CardHolder[]> {
    return this.getItems().pipe(
      map(cardHolders => cardHolders.filter(holder => 
        (holder.cardgenerated === true)
      ))
    );
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
    
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
   
    return throwError(
      'Something bad happened; please try again later.');
  }
  addItem(cardHolder: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),
      'RefrechTokenV': this.JwtAuthService.getRefreshToken()
    });
  
    const options = { headers: headers };
    console.log("refrechtoken",this.JwtAuthService.getRefreshToken())
    return this.http.post<any>(`${this.apiUrl}/CardHolder`, cardHolder, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  resetCardGenerated(customerId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),
      'RefrechTokenV': this.JwtAuthService.getRefreshToken()
    });
    const url = `${this.apiUrl}/${customerId}/resetCardGenerated`;
    return this.http.put(url, null, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getpbf(id: number): Observable<any> {
    const url = `http://localhost:8085/api/auth/card/test/CardHolder/pbf/${id}`;
    return this.http.get<any>(url).pipe(
      tap(response => console.log('Response from server:', response)),
      catchError(this.handleError)
    );
}

  
  
}