import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, tap, catchError } from 'rxjs';
import { User } from '../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users!:User[];
  user!:User;

  constructor(
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
    return this.http.get<User>(`https://localhost:7042/api/Users/userby/${userId}`, this.getHttpOptions() )
    .pipe(
      tap(user=>console.log(user)),
      catchError(this.handleError<User>('getUser'))
    )
  }
  updatePassword(email: string, password: string): Observable<any> {
    const url = `https://localhost:7042/api/Users/updatePassword/${email}`;
    const payload = { password }; 
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
