import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pbf } from 'app/shared/models/Cardholder';
import { Observable, throwError, map } from 'rxjs';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { environment } from 'environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class GpbfService {

  items: any[];
  private apiUrl = environment.port+'/api/auth/file';
  constructor(
    private http: HttpClient,
    private JwtAuthService :JwtAuthService
  ) {}

  getItems(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),
    
    });
    return this.http.get<any[]>(`${this.apiUrl}/allPBF`,{ headers })
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

  getnotgenerated(): Observable<pbf[]> {
    return this.getItems().pipe(
      map((data: pbf[]) => data.filter(holder => holder.pbfgenerated == false))
    );
  }
  

  


  generatepbfFile(customerIds: number[]): Observable<HttpResponse<string>> {
    const url = `${this.apiUrl}/generate-PBF-file`;
    const params = new HttpParams().set('customerIds', customerIds.join(','));

    return this.http.get<string>(url, { params, observe: 'response', responseType: 'text' as 'json' });
  }

}
