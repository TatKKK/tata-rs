import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, tap, catchError } from 'rxjs';
import { User } from '../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth/auth.service';
import { MessageService } from 'primeng/api'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users!:User[];
  user!:User;

  constructor(
    private messageService:MessageService,
    public snackBar:MatSnackBar,
    private http:HttpClient,
    private authService:AuthService,

  ) { }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authService.getToken() ? `Bearer ${this.authService.getToken()}` : ''
      })
    };
  }



  addUser(formData: any): Observable<any> {
    let token = this.authService.getToken()
    if (!this.authService.isAdmin()) {
      this.messageService.add({
        key: 'tl',
        severity: 'error',
        summary: 'Unauthorized',
        detail: 'Not authorized',
        life: 2000
      })
    }

    if (!this.authService.getToken()) {
      this.messageService.add({
        key: 'tl',
        severity: 'warn',
        summary: 'Unauthorized',
        detail: 'No Token',
        life: 2000
      })
    }

    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }

    return this.http
      .post<any>('https://localhost:7042/api/Users/AddUser', formData, httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error adding admin:', error)
          return throwError(() => error)
        })
      )
  }
  getUsersList():User[]{
    return this.users;
  }

  setUsersList(list:User[]){
    this.users=list;
  }

  getUserByEmail(Email:string):Observable<User>{
    return this.http.get<User>(`https://localhost:7042/api/Users/userby/${Email}`, this.getHttpOptions() )
    .pipe(
      tap(user=>console.log(user)),
      catchError(this.handleError<User>('getUser'))
    )
  }

  getUser(userId:number):Observable<User>{
    return this.http.get<User>(`https://localhost:7042/api/Users/user/${userId}`, this.getHttpOptions() )
    .pipe(
      tap(user=>console.log(user)),
      catchError(this.handleError<User>('getUser'))
    )
  }
  updatePassword(email: string, password: string): Observable<any> {
    const url = `https://localhost:7042/api/Users/updatePassword/${email}`;
    const payload = { password }; 
    console.log(payload);
    return this.http.put(url, payload);
  }
  
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {    
      
      console.error(`${operation} failed: ${error.message}`);
  
      if (error instanceof HttpErrorResponse) {
        console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
      }
  
      this.log(`${operation} failed: ${error.message}`);
  
      return of(result as T);
    };
  }
  private log(message: string) {  
    console.log(message);
  }
}
