import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, delay, catchError, map, throwError } from 'rxjs';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { CardHolder } from 'app/shared/models/Cardholder';
import { environment } from 'environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class GeneratedfileService {
  items: any[];
  private apiUrl = environment.port+'/api/auth/card';
  constructor(
    private http: HttpClient,
    private JwtAuthService :JwtAuthService
  ) {}
  generateDataInputForCards(customerIds: number[]): Observable<any> {
    const params = new HttpParams().set('customerIds', customerIds.join(','));

    return this.http.get(`${this.apiUrl}/generateDataInput`, { params });
  }

  getItems(): Observable<CardHolder[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),
  
    });
    return this.http.get<CardHolder[]>(`${this.apiUrl}/all`,{ headers }).pipe(
      catchError(this.handleError)
    );
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
  updateItem(customerId: number ,CardHolder:any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),
      'RefrechTokenV': this.JwtAuthService.getRefreshToken()
    });
    const url = `${this.apiUrl}/${customerId}`;
    return this.http.put<any>(url,CardHolder,{ headers }).pipe(
      catchError(this.handleError)
    );
  }
  getConfirmedCardHolders(): Observable<CardHolder[]> {
    return this.getItems().pipe(
      map(cardHolders => cardHolders.filter(holder => holder.confirmation === true))
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

  getAllUploadedDataCardHolders(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),
      'RefrechTokenV': this.JwtAuthService.getRefreshToken()
    });

    return this.http.get(`${this.apiUrl}/Uplodedfile`, { headers });
  }
  confirmgeneratedt(customerId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),
      'RefrechTokenV': this.JwtAuthService.getRefreshToken()
    });
    const url = `${this.apiUrl}/${customerId}/genreted`;
    return this.http.put(url, null,{ headers }).pipe(
      catchError(this.handleError)
    );
  }
  

  getCardsCreatedAndNotConfirmed(): Observable<CardHolder[]> {
    return this.getItems().pipe(
      map(cards => cards.filter(card => 
        card.createdAt && !card.confirmation)
      )
    );
  }
  
  getCardsConfirmedAndNotGenerated(): Observable<CardHolder[]> {
    return this.getItems().pipe(
      map(cards => cards.filter(card => 
        card.confirmation && !card.cardgenerated)
      )
    );
  }
  
  getCardsUpdatedAndNotGenerated(): Observable<CardHolder[]> {
    return this.getItems().pipe(
      map(cards => cards.filter(card => 
        card.updatedAt && !card.cardgenerated)
      )
    );
  }

  generateCafFile(cafFileRequest: { customerIds: string[] }): Observable<Blob> {
    const params = new HttpParams().set('customerIds', cafFileRequest.customerIds.join(','));
    return this.http.get(`${this.apiUrl}/generate-caf-file`, { params: params, responseType: 'blob' });
}

generatePBFFile(PBFFileRequest: { customerIds: string[] }): Observable<Blob> {
    const params = new HttpParams().set('customerIds', PBFFileRequest.customerIds.join(','));
    return this.http.get(`${this.apiUrl}/generate-PBF-file`, { params: params, responseType: 'blob' });
}

}  
