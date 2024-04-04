import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Patient } from '../models/patient.model';
import { PatientDto } from '../models/patient.model';
import { ActivationCode } from '../models/patient.model';

import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  public patients:PatientDto[]=[];
  public patientsG:Patient[]=[];

  constructor( private http: HttpClient,
                private authService:AuthService) { }

  
  
//Chveulebrivebi
  get PatientsList():Patient[]{
    return this.patientsG;
  }
  set PatientsList(list:Patient[]){
    this.patientsG=list;
  }
  
  private getHttpOptions() {
    const token = this.authService.getToken(); 
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(message);
  }

getPatients(): Observable<Patient[]> {
  return this.http.get<Patient[]>("https://localhost:7042/api/Patients", this.getHttpOptions())
    .pipe(
      tap(patients => {
        this.PatientsList = patients;
        console.log(patients);
      }),
      catchError(this.handleError<Patient[]>('getPatients', []))
    );
}

getPatientByEmail(Email: string): Observable<Patient> {
  return this.http.get<Patient>(`https://localhost:7042/api/Patients/patient/email/${Email}`, this.getHttpOptions())
    .pipe(
      tap(patient => console.log(patient)),
      catchError(this.handleError<Patient>('getPatient'))
    );
}
getPatient(id: number): Observable<Patient> {
  return this.http.get<Patient>(`https://localhost:7042/api/Patients/patient/${id}`, this.getHttpOptions())
    .pipe(
      tap(patient => console.log(patient)),
      catchError(this.handleError<Patient>('getPatient'))
    );
}
  
  addPatient(formData: any): Observable<any> {    
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  return this.http.post<any>("https://localhost:7042/api/Patients", formData)
    .pipe(
      catchError(error => {
        console.error('Error adding patient:', error);
        return throwError(() => error);
      })
    );
    }
 
    
    editPatient(formData:any):Observable<any>{
      return this.http.put<any>("https://localhost:7042/api/Patients", formData, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error('Error editing patient:', error);
          return throwError(() => error);
        })
      );
    }

deletePatient(patient: Patient): Observable<any> {
  const url = `https://localhost:7042/api/Patients/${patient.Id}`;
  return this.http.delete<any>(url, this.getHttpOptions())
    .pipe(
      catchError(error => {
        console.error('Error deleting patient', error);
        return throwError(() => error);
      })
    );
}

createActivationCode(Email: string): Observable<any> {
  return this.http.post<any>('https://localhost:7042/api/Codes/CreateCode', { UserEmail: Email })
    .pipe(
      catchError(error => {
        console.error('Error creating activation key:', error);
        return throwError(() => new Error('Error creating activation key'));
      })
    );
}

getActivationCodeByEmail(email: string): Observable<ActivationCode> {
  return this.http.get<ActivationCode>(`https://localhost:7042/api/Codes/getCode?email=${email}`);
}

// VEREIFY !!!

verifyActivationCode(email:String, activationCode: string): Observable<boolean> {  
  const url = 'https://localhost:7042/api/Codes/verify';
  return this.http.post<{ IsValid: boolean }>(url, { UserEmail: email, ActivationCode_: activationCode })
    .pipe(
      map(response => response.IsValid),
      catchError(error => {
        console.error('Error verifying code:', error);
        return of(false); 
      })
    );
    }
}
