import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Subject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class InboxService {
  private refreshSubject = new Subject();
  refreshObservable$ = this.refreshSubject.asObservable();
  constructor(private http: HttpClient) { }
  inboxUrl = '/webhook-inbox';

  createInbox() {
    return this.http.post<any>(this.inboxUrl, null, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  refreshInbox() {
    this.refreshSubject.next();
  }

  getInbox(name: string) {
    return this.http.get<any>(this.inboxUrl + '/' + name)
      .pipe(
        //  retry(3), // retry a failed request up to 3 times
        catchError(this.handleError)
      );
  }

  saveConfigKey(inboxName: string, key: string) {
    const url = this.inboxUrl + '/' + inboxName + '/config/' + key;
    return this.http.post<any>(url, null, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteConfigKey(inboxName: string, key: string) {
    const url = this.inboxUrl + '/' + inboxName + '/config/' + key;
    return this.http.delete<any>(url, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getInboxNotifications(name: string) {
    return this.http.get<any>(this.inboxUrl + '/' + name + '/notification')
      .pipe(
        // retry(3), // retry a failed request up to 3 times
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errMsg;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      errMsg = error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
      errMsg = error.error.message;
    }
    // return an observable with a user-facing error message
    return throwError(errMsg);
  };
}
