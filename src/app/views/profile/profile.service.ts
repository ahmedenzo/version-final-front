import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable,  throwError } from 'rxjs';
import { catchError, tap,finalize  } from 'rxjs/operators';
import { Bank,Bin,agence ,ConfigureDataRequest} from 'app/shared/models/bank';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as countrycitystatejson from 'countrycitystatejson';
import { environment } from 'environments/environment.prod';

@Injectable()
export class Service {
  private apiUrl = environment.port+'/api/auth/banks';
  private apiUrlagence = environment.port+'/api/auth/agencies';
  private apiUrlbin = environment.port+'/api/auth/bins';

  private countryData = countrycitystatejson;
  constructor(private http: HttpClient,private snackBar: MatSnackBar)
     {  }
     createAgency(agence: agence, bankname: string): Observable<agence> {
      return this.http.post<agence>(`${this.apiUrlagence}/create?bankname=${bankname}`, agence);
    }
  
    updateAgency(id: number, updatedAgency: agence): Observable<agence> {
      return this.http.put<agence>(`${this.apiUrlagence}/${id}`, updatedAgency);
    }
  
    deleteAgency(id: number): Observable<string> {
      return this.http.delete<string>(`${this.apiUrlagence}/${id}`);
    }
  

     createBin(bin: Bin, bankName: string): Observable<Bin> {
      const url = `${this.apiUrlbin}/create?bankname=${bankName}`;
      return this.http.post<Bin>(url, bin);
    }
     updateBin(id: number, updatedBin: Bin): Observable<Bin> {
      const url = `${this.apiUrlbin}/${id}`;
      return this.http.put<Bin>(url, updatedBin);
    }
  
    deleteBin(id: number): Observable<any> {
      const url = `${this.apiUrlbin}/${id}`;
      return this.http.delete<any>(url);
    }

    configureData(request: ConfigureDataRequest, bankName: string): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
  
      return this.http.post(`${this.apiUrl}/configureData/${bankName}`, request, { headers: headers })
        .pipe(
          catchError(error => {
            if (error.status === 400 && error.error && error.error.message === 'Bank is already configured.') {
              // Handle the BankAlreadyHasDataException error and show snackbar message
              this.snackBar.open('Bank is already configured.', 'OK', { duration: 2000 });
            } else {
              // Handle other errors and show a generic error message
              this.snackBar.open('An error occurred while configuring the bank.', 'OK', { duration: 2000 });
            }
            // Rethrow the error to propagate it to the component
            return throwError(error);
          }),
          
        );
    }

     getItemsbanks(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}`).pipe(
          catchError(this.handleError)
        );
      }
          
      getAgenciesByBank(bankName: string): Observable<agence[]> {
        const url = `${this.apiUrlagence}/by-bank/${bankName}`;
        return this.http.get<agence[]>(url);
      }
      getItemsbin(): Observable<Bank[]> {
        return this.http.get<Bank[]>(`${this.apiUrlbin}`).pipe(
          catchError(this.handleError)
        );
      }
 
      getAllAgencies(): Observable<agence[]> {
        const url = `${this.apiUrlagence}/agencies`;
        return this.http.get<agence[]>(url);
      }

      getBinsByBank(bankName: string): Observable<Bin[]> {
        const url = `${this.apiUrlbin}/by-bank/${bankName}`;
        return this.http.get<Bin[]>(url);
      }
       // GET an item by id
       getItem(id: number): Observable<Bank> {
        const url = `${this.apiUrlbin}/${id}`;
        return this.http.get<Bank>(url).pipe(
          catchError(this.handleError)
        );
      }

  
      
    
       // GET an item by id
       getItembin(id: number): Observable<Bank> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Bank>(url).pipe(
          catchError(this.handleError)
        );
      }
    
      // POST a new item
      addItem(bank: any): Observable<any> {
        
        return this.http.post<any>(`${this.apiUrl}`, bank).pipe(
          catchError(this.handleError)
        );
      }
    
      // PUT an existing item
      updateItem(id: number, bank: Bank): Observable<Bank> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<Bank>(url, bank).pipe(
          catchError(this.handleError)
        );
      }
    
      // DELETE an item by id
      deleteItem(id: number): Observable<Bank> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<Bank>(url).pipe(
          catchError(this.handleError)
        );
      }
    
    
      private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        // Return an observable with a user-facing error message.
        return throwError(
          'Something bad happened; please try again later.');
      }
      getCountries() {
        return this.countryData.getCountries();
      }
    
      getStatesByCountry(name: string) {
        return this.countryData.getStatesByShort(name);
      }


}