import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ListefileService {
  items: any[];
  private apiUrl = 'http://localhost:8085/api/auth/card';
  private apiUrlupload = 'http://localhost:8085/api/auth/card/upload';

  constructor(   private http: HttpClient,
    private JwtAuthService :JwtAuthService) { }

    getItems(): Observable<any[]> {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken(),
      
      });
      return this.http.get<any[]>(`${this.apiUrl}/files/all`,{ headers })
    }

    downloadFile(filename: string): Observable<HttpResponse<Blob>> {
      const url = `${this.apiUrl}/download/${filename}`;
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken()
      });
      return this.http.get(url, {
        headers: headers,
        responseType: 'blob',
        observe: 'response'
      });


    }
    uploadFiles(fileInformationIds: number): Observable<any> {
      const params = { fileInformationIds: fileInformationIds };
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken()
      });
  
      return this.http.post<any>(this.apiUrlupload, null, { params, headers });
    }
}
