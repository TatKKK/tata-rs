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

   addUser(formData: any): Observable<any> {
    return this.http.post<any>('https://localhost:7042/api/Users/AddUser', formData);
  }
  getUsersList():User[]{
    return this.users;
  }

  setUsersList(list:User[]){
    this.users=list;
  }


  getUser(userId:number):Observable<User>{
    return this.http.get<User>(`https://localhost:7042/api/Users/user/${userId}` );
  }
  updatePassword(email: string, password: string): Observable<any> {
    const url = `https://localhost:7042/api/Users/updatePassword/${email}`;
    const payload = { password }; 
    console.log(payload);
    return this.http.put(url, payload);
  }
  
  
}
