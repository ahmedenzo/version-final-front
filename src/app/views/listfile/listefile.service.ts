import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class ListefileService {
  items: any[];
  private apiUrl = environment.port+'/api/auth/card';
  private apiUrlupload = environment.port+'/api/auth/card/upload';
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
