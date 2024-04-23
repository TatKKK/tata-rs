import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Login } from '../../models/user.model'
import { Observable, catchError, throwError, tap, BehaviorSubject , map} from 'rxjs'
import { Router } from '@angular/router'
import { Injectable } from '@angular/core'
import { jwtDecode } from 'jwt-decode'


@Injectable({
  providedIn: 'root'
})
export class AuthService { 

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userRoleSubject = new BehaviorSubject<'patient' | 'doctor' | 'admin' | 'unknown'>('unknown');
  private userImageUrl = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private router: Router) {
    this.updateLoginStatus();
    this.checkTokenAndSetUserDetails();
  }

  isLoggedInSync (): boolean {
    return this.isLoggedInSubject.value
  }

  private updateLoginStatus (): void {
    this.isLoggedInSubject.next(this.hasToken())
  }

  private hasToken (): boolean {
    return !!this.getToken()
  }

  public isLoggedIn (): Observable<boolean> {
    return this.isLoggedInSubject.asObservable()
  }

  authenticate(login: Login): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<any>('https://localhost:7042/api/Users/Authenticate', login, httpOptions)
      .pipe(map(user => {
        if (user && user.AccessToken) {
          
          localStorage.setItem('token', user.AccessToken);  
          localStorage.setItem('isAuth', 'true');  
          this.setUserDetailsFromToken(user.AccessToken);
        
          this.updateLoginStatus();
        }
        return user;
      }));
  }

  private checkTokenAndSetUserDetails(): void {
    const token = this.getToken();
    if (token) {
      this.setUserDetailsFromToken(token);
    }
  }

  private setUserDetailsFromToken(token: string): void {
    try {    
      const decodedToken = jwtDecode<any>(token);
      const role = decodedToken['role'] as 'patient' | 'doctor' | 'admin' | 'unknown';
      const imageUrl = decodedToken['ImageUrl'] || '';
      const userId = decodedToken['nameid'] || '';
      const email = decodedToken['email'] || '';
      this.userRoleSubject.next(role);
      this.userImageUrl.next(imageUrl);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userImageUrl', imageUrl);
    } catch (error) {
      console.error('Error decoding token', error);
      this.userRoleSubject.next('unknown');
      this.userImageUrl.next('');
      localStorage.setItem('isAuth', 'false');
    }
  }

  public logout(): void {
    this.removeToken();
    localStorage.clear();
    this.userRoleSubject.next('unknown');
    this.isLoggedInSubject.next(false);
    this.userImageUrl.next('');
    this.router.navigate(['/']);
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  private removeToken(): void {
    localStorage.removeItem('token');
    localStorage.setItem('isAuth', 'false');
  }

  getUserRole(): Observable<'patient' | 'doctor' | 'admin' | 'unknown'> {
    return this.userRoleSubject.asObservable();
  }

  getImageUrl(): Observable<string> {
    return this.userImageUrl.asObservable();
  }

  getUserIdFromToken (token: string): number | null {
    try {
      const decodedToken = jwtDecode<any>(token)
      return +decodedToken['nameid'] //Claimtype rato arao..
    } catch (error) {
      console.error('Error decoding token', error)
      return null
    }
  }

  getUserId (): number | null {
    const token = this.getToken()
    if (!token) return null
    return this.getUserIdFromToken(token)
  }

  isAdmin(): Observable<boolean> {
    return this.userRoleSubject.asObservable().pipe(map(role => role === 'admin'));
  }

  isPatient(): Observable<boolean> {
    return this.userRoleSubject.asObservable().pipe(map(role => role === 'patient'));
  }

  isDoctor(): Observable<boolean> {
    return this.userRoleSubject.asObservable().pipe(map(role => role === 'doctor'));
  }


  //localStorage დან რო შეამოწმოს

  getUserRoleSync(): 'patient' | 'doctor' | 'admin' | 'unknown' {
    return localStorage.getItem('userRole') as 'patient' | 'doctor' | 'admin' | 'unknown' || 'unknown';
  }

  isAdminSync(): boolean {
    const role = localStorage.getItem('userRole');
    return role === 'admin';
  }
  isPatientSync():boolean{
    const role = localStorage.getItem('userRole');
    return role === 'patient';
  }

  isDoctorSync():boolean{
    const role = localStorage.getItem('userRole');
    return role === 'doctor';
  }
}