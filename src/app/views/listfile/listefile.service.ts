import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { EMPTY, Observable, finalize, switchMap } from 'rxjs';
import { environment } from 'environments/environment.prod';
import { TranslateService } from '@ngx-translate/core';
import { FileConfirmationDialogComponent } from '../cruds/crud-Dialog/file-confirmation-dialog/file-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
@Injectable({
  providedIn: 'root'
})
export class ListefileService {
  items: any[];
  private apiUrl = environment.port+'/api/auth/card';
  private apiUrlupload = environment.port+'/api/auth/card/upload';
  constructor(   private http: HttpClient,private translate: TranslateService,  private dialog: MatDialog,private loader: AppLoaderService,
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
      const title = this.translate.instant('CONFIRMATION');
      const text = this.translate.instant('DO YOU WANT TO SEND THIS CARD?');
      const dialogRef = this.dialog.open(FileConfirmationDialogComponent, {
        width: '400px',
        data: { title, text },
        panelClass: 'red-dialog'
      });
    
      return dialogRef.afterClosed().pipe(
        switchMap(result => {
          if (result) {
            const loaderMessage = this.translate.instant('SEND FILE');
            this.loader.open(loaderMessage);
    
            const params = { fileInformationIds: fileInformationIds };
            const headers = new HttpHeaders({
              'Authorization': 'Bearer ' + this.JwtAuthService.getJwtToken()
            });
    
            return this.http.post<any>(this.apiUrlupload, null, { params, headers }).pipe(
              finalize(() => {
                this.loader.close();
              })
            );
          } else {
            return EMPTY; // or throw an error, log, etc.
          }
        })
      );
    }
    
    


}
