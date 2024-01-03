import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CardHolder } from 'app/shared/models/Cardholder';
import { Observable } from 'rxjs';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { environment } from 'environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class PbfService {
  items: any[];
  private apiUrl = environment.port+'/api/auth/file';
  private apiUrlcard = environment.port+'/api/auth/card';
  

  constructor(
    private http: HttpClient,
    private JwtAuthService :JwtAuthService
  ) {}

  //******* Implement your APIs ********
  getItems(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),
    
    });
    return this.http.get<any[]>(`${this.apiUrl}/allPBF`,{ headers })
  }
  updatePBFRecord(pbfId: number, newRecord: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrlcard}/pbf-record/${pbfId}`, newRecord);
  }

}
