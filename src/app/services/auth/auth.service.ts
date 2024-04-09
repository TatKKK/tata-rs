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

  
  private userRole: 'patient' | 'doctor' | 'admin' | 'unknown' = 'unknown';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userImageUrl = new BehaviorSubject<string>('');

  private userRoleSubject = new BehaviorSubject<'patient' | 'doctor' | 'admin' | 'unknown'>('unknown');

  setUserRole(token: string): void {
    if (typeof token !== 'string' || token.trim() === '') {
      console.error('Token is not a string or is empty');
      this.userRoleSubject.next('unknown'); 
      return;
    }
    try {
      const decodedToken = jwtDecode<any>(token);
      const role = decodedToken.role as 'patient' | 'doctor' | 'admin' | 'unknown';
      this.userRoleSubject.next(role); 
      console.log(role + ' userRole is set');
    } catch (error) {
      console.error('Error decoding token', error);
      this.userRoleSubject.next('unknown'); 
    }
  }

  getUserRole(): Observable<'patient' | 'doctor' | 'admin' | 'unknown'> {
    return this.userRoleSubject.asObservable(); 
  }


  setImageUrl (imageUrl: string): void {
    this.userImageUrl.next(imageUrl)
  }

  getImageUrl (): Observable<string> {
    return this.userImageUrl.asObservable()
  }

  isLoggedInSync (): boolean {
    return this.isLoggedInSubject.value
  }

  constructor (private http: HttpClient, private router: Router) {
    this.updateLoginStatus();
    this.checkTokenAndSetUserDetails();
  }

  private checkTokenAndSetUserDetails(): void {
    const token = this.getToken();
    if (token) {
      this.setUserDetailsFromToken(token);

    }
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

  public logout(): void {
    this.removeToken();
    localStorage.clear();
    this.userRoleSubject.next('unknown');
    this.isLoggedInSubject.next(false);
    this.userImageUrl.next('');
    this.router.navigate(['/']);
  }
  

  authenticate (login: Login): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    return this.http
      .post<any>(
        'https://localhost:7042/api/Users/Authenticate',
        login,
        httpOptions
      )
      .pipe(
        tap(res => {
          this.setToken(res.AccessToken)
          this.setUserRole(res.AccessToken)
          this.updateLoginStatus()
        }),
        catchError(error => {
        
          return throwError(() => new Error('Authentication failed'))
        })
      )
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

  getUserIdFromToken (token: string): number | null {
    try {
      const decodedToken = jwtDecode<any>(token)
      return +decodedToken['nameid'] //Claimtype rato arao..
    } catch (error) {
      console.error('Error decoding token', error)
      return null
    }
  }
  getUserNameFromToken (token: string): string | null {
    try {
      const decodedToken = jwtDecode<any>(token)
      const givenName = decodedToken['given_name'] || ''
      const familyName = decodedToken['family_name'] || ''
      return (givenName + ' ' + familyName).trim() || null
    } catch (error) {
      console.error('Error decoding token', error)
      return null
    }
  }
  getImageUrlFromToken (token: string): string | null {
    try {
      const decodedToken = jwtDecode<any>(token)
      return decodedToken['ImageUrl'] || null
    } catch (error) {
      console.error('Error decoding token', error)
      return null
    }
  }

  getUserRoleFromToken(token: string): string | null {
    try {
      const decodedToken = jwtDecode<any>(token);
      const userRole = decodedToken['role'] as string; 
      return userRole || 'unknown';
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }
  

  getUserId (): number | null {
    const token = this.getToken()
    if (!token) return null
    return this.getUserIdFromToken(token)
  }
  setUserDetailsFromToken(token: string): void {
    try {
      const decodedToken = jwtDecode<any>(token);
      const imageUrl = decodedToken['ImageUrl'];
      if (imageUrl) {
        this.setImageUrl(imageUrl);
      }
    } catch (error) {
      console.error('Error decoding token', error);
    }
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.setUserDetailsFromToken(token);
    this.isLoggedInSubject.next(true);
  }
  

  getToken (): string | null {
    return localStorage.getItem('token')
  }

  private removeToken (): void {
    localStorage.removeItem('token')
  }


  /* emailistvis */
  private userEmail = new BehaviorSubject<string>('');

setUserEmail(email: string) {
  this.userEmail.next(email);
}

getUserEmail(): Observable<string> {
  return this.userEmail.asObservable();
}
}
