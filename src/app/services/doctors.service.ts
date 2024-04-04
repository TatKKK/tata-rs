import { DoctorDto } from '../models/doctor.model';
import { Doctor } from '../models/doctor.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { SignalRService } from './signal-r.service';
import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { HttpResponse } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

interface PaginatedDoctorResult {
  TotalCount: number;
  PageSize: number;
  PageNumber: number;
  Doctors: Doctor[];
}

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {
  public doctors:DoctorDto[]=[];
  public doctorsG:Doctor[]=[];

  constructor(
    public snackBar:MatSnackBar,
    private http:HttpClient,
    private authService:AuthService,
    private signalRService: SignalRService) {}  
    public incrementViewCount(doctorId: number): void {
      this.signalRService.hubConnection.invoke('UpdateViewCount', doctorId).catch((err) => console.error(err));
    }
    private currentDoctorId = new BehaviorSubject<number | null>(null)
    currentDoctorId$ = this.currentDoctorId.asObservable()
  
    setCurrentDoctorId (doctorId: number): void {
      this.currentDoctorId.next(doctorId)
    }

private getHttpOptions() {
  return {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authService.getToken() ? `Bearer ${this.authService.getToken()}` : ''
    })
  };
}


  get DoctorsList():Doctor[]{
    return this.doctorsG;
  }
  set DoctorsList(list:Doctor[]){
    this.doctorsG=list;
  }
  
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>("https://localhost:7042/api/Doctors/docs", this.getHttpOptions())
      .pipe(
        tap(doctors => {
          this.DoctorsList = doctors;
          console.log(doctors);
        }),
        catchError(this.handleError<Doctor[]>('getDoctors', []))
      );
  }

  getDoctorByEmail(Email:String): Observable<Doctor> {
    return this.http.get<Doctor>(`https://localhost:7042/api/Doctors/doctor/email/${Email}`, this.getHttpOptions())
      .pipe(
        tap(doctor => console.log(doctor)),
        catchError(this.handleError<Doctor>('getDoctor'))
      );
  }
  getDoctor(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`https://localhost:7042/api/Doctors/doctor/${id}`, this.getHttpOptions())
      .pipe(
        tap(doctor => console.log(doctor)),
        catchError(this.handleError<Doctor>('getDoctor'))
      );
  }
 

  getStars(score: number) {
    return new Array(5).fill(false).map((_, index) => index < score);
  }
  
   addDoctor(formData:any): Observable<any> {
    let token=this.authService.getToken();
    if(!this.authService.isAdmin()){
      this.snackBar.open(` Log in as admin; kaldani.tata@gmail.com/password:T123456*.`, 'Close', {
        duration: 5000,
      });   } 

      if(!this.authService.getToken()){
        this.snackBar.open(`No Token`, 'Close', {
          duration: 5000,
        });;
      }
      let httpOptions={
        headers:new HttpHeaders({
          'Authorization':`Bearer ${token}`
        })
      };
    
    return this.http.post<any>("https://localhost:7042/api/Doctors", formData, httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error adding doctor:', error);
          return throwError(() => error);
        })
      );
  }


  editDoctor(formData:any):Observable<any>{
    let token=this.authService.getToken();
    if(!this.authService.isAdmin()){
      alert('Unauthorized');   } 

      if(!this.authService.getToken()){
        alert('No Token');
      }
      let httpOptions={
        headers:new HttpHeaders({
          'Authorization':`Bearer ${token}`
        })
      };
    return this.http.put<any>("https://localhost:7042/api/Doctors", formData, httpOptions)
    .pipe(
      catchError(error => {
        console.error('Error editing doctor:', error);
        return throwError(() => error);
      })
    );
  }

  deleteDoctor(doctor: Doctor): Observable<any> {

    let token = this.authService.getToken();
    if (!this.authService.isAdmin()) {
      return throwError(() => new Error('Unauthorized'));
    }

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  
    const url = `https://localhost:7042/api/Doctors/deletedoctor/${doctor.Id}`;
    return this.http.delete<any>(url, httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error deleting doctor', error);
          return throwError(() => error);
        })
      );
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
getDoctorsByCategory(category: string): Observable<Doctor[]> {
  return this.http.get<Doctor[]>(`https://localhost:7042/api/Doctors/category/${category}`);
}
  private _paginatedDoctorsResult!: PaginatedDoctorResult;
  get PaginatedDoctorsResult(): PaginatedDoctorResult {
    return this._paginatedDoctorsResult;
  }
  set PaginatedDoctorsResult(value: PaginatedDoctorResult) {
    this._paginatedDoctorsResult = value;
  }
  getDoctorsPaginated(pageNumber: number = 1, pageSize: number = 6): Observable<PaginatedDoctorResult> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    let httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: params
    };
  
    return this.http.get<PaginatedDoctorResult>("https://localhost:7042/api/Doctors/docsPaginate", httpOptions)
      .pipe(
        tap(response => {
          console.log('getDoctorsPaginated response:', response);
          this._paginatedDoctorsResult = response;
        }),
        catchError(this.handleError<PaginatedDoctorResult>('getDoctorsPaginated'))
      );
  }
  
  refreshDoctors(): void {
    this.getDoctors().subscribe(doctors => {
      this.DoctorsList = doctors;
    });
  }

}

