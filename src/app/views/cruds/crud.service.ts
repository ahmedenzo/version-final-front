import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserDB } from '../../shared/inmemory-db/users';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { CardHolder } from 'app/shared/models/Cardholder';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { Bin } from 'app/shared/models/bank';
import { environment } from 'environments/environment.prod';
@Injectable()
export class CrudService {
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
    return this.http.get<CardHolder[]>(`${this.apiUrl}/all`,{ headers })
  }
  getItemsnotconfirmation(): Observable<CardHolder[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),
    
    });
    return this.http.get<CardHolder[]>(`${this.apiUrl}/all`,{ headers }).pipe(
      map(cardHolders => cardHolders.filter(holder => holder.confirmation === false))
    )
  }

  getBinsByBank(bankName: string): Observable<Bin[]> {
    const url = `${this.apiUrlbin}/by-bank/${bankName}`;
    return this.http.get<Bin[]>(url);
  }
  getBins(): Observable<Bin[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),
      'RefrechTokenV': this.JwtAuthService.getRefreshToken()
    });
    return this.http.get<Bin[]>(`${this.apiUrl}/CardHolder`,{ headers }).pipe(
    
      catchError(this.handleError)
    );
  }


  getItem(id: number): Observable<CardHolder> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),
     
    });
    
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<CardHolder>(url,{ headers }).pipe(
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




  getUnconfirmedCardHolders(): Observable<CardHolder[]> {
    return this.getItems().pipe(
      map(cardHolders => cardHolders.filter(holder => holder.confirmation === false))
    );
  }

  

  getAllFiles(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),
      'RefrechTokenV': this.JwtAuthService.getRefreshToken()
    });
    return this.http.get<any>(this.apiUrl, { headers })
      .pipe(
        catchError(this.handleError)
      );
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
  addItem2(selectedBinId: number, cardHolder: CardHolder): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),
    });

    // Include selectedBinId as a query parameter
    let params = new HttpParams();
    params = params.append('selectedBinId', selectedBinId.toString());

    return this.http.post<any>(`${this.apiUrl}/CreateNewCard`, cardHolder, { headers, params })
   
  }

  
  
  confirmDataInputCart(customerId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),
   
    });
    const url = `${this.apiUrl}/${customerId}/confirmation`;
    return this.http.put(url, null,{ headers }).pipe(
      catchError(this.handleError)
    );
  }
  




  updateCardHolderData(customerId: number, selectedBinId: number, updatedData: CardHolder): Observable<any> {
     const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),
     
    });
    const url = `${this.apiUrl}/${customerId}/update/${selectedBinId}`;
    return this.http.put(url, updatedData, { headers});
  }




  deleteCardHolder(customerId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),
     
    });
    const url = `${this.apiUrl}/${customerId}`;
    return this.http.delete<any>(url,{ headers }).pipe(
      catchError(this.handleError)
    );
  }

  getCardHoldersByDay(fixedDay: string): Observable<CardHolder[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),
      'RefrechTokenV': this.JwtAuthService.getRefreshToken()
    });
    const url = `${this.apiUrl}/${fixedDay}`;
    return this.http.get<CardHolder[]>(url,{ headers });
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

  uploadFile(formData: FormData): Observable<string> {
    return this.http.post(`${this.apiUrl}/upload`, formData, { responseType: 'text' }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Error uploading file';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Client-side error: ${error.error.message}`;
        } else if (error.status === 401) {
          errorMessage = 'Failed to connect to FTP server. Please check your credentials.';
        } else if (error.status === 500) {
          errorMessage = 'Failed to upload file. Please try again later.';
        } else {
          errorMessage = `Server-side error: ${error.status} - ${error.message}`;
        }
        return throwError(errorMessage);
      })
    );
  }
  


  
}