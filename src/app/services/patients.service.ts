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
  
getPatients(): Observable<Patient[]> {
  return this.http.get<Patient[]>("https://localhost:7042/api/Patients");
}

getPatient(id: number): Observable<Patient> {
  return this.http.get<Patient>(`https://localhost:7042/api/Patients/patient/${id}`);
}
  
  addPatient(formData: any): Observable<any> {    
  return this.http.post<any>("https://localhost:7042/api/Patients", formData);
    }
 
    
    editPatient(formData:any):Observable<any>{
      return this.http.put<any>("https://localhost:7042/api/Patients", formData);
    }

deletePatient(patient: Patient): Observable<any> {
  return this.http.delete<any>(`https://localhost:7042/api/Patients/${patient.Id}`);
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
