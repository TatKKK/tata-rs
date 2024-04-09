// import { Injectable } from '@angular/core'
// import { HttpClient, HttpHeaders } from '@angular/common/http'
// import { Appointment } from './models/appointment.model'
// import { Observable, BehaviorSubject, catchError, of } from 'rxjs'

// @Injectable({
//   providedIn: 'root'
// })
// export class AppointmentsService {
//   public appointments: Appointment[] = []

//   constructor (private http: HttpClient) {}

//   //DOCTORS
//   private currentDoctorId = new BehaviorSubject<number | null>(null)
//   currentDoctorId$ = this.currentDoctorId.asObservable()

//   setCurrentDoctorId (doctorId: number): void {
//     this.currentDoctorId.next(doctorId)
//   }

//   getAppointmentsByDoctor (doctorId: number): Observable<Appointment[]> {
//     let httpOptions={
//       headers:new HttpHeaders({
//         "Content-Type":"application/json"
//       })
//     };
//     return this.http.get<Appointment[]>(
//       `https://localhost:7042/api/Appointments/appointments/doctor/${doctorId}`, httpOptions
//     )
//     .pipe(
//       catchError(this.handleError<Appointment[]>('getAppointmentsByDoctor'))
//     );
    
//   }

//   createAppointment (appointment: Appointment): Observable<Appointment> {
//     return this.http.post<Appointment>(
//       'https://localhost:7042/api/Appointments',
//       appointment
//     )
//   }

//   //Patients
//   private currentPatientId = new BehaviorSubject<number | null>(null)
//   currentPatientId$ = this.currentPatientId.asObservable()

//   setCurrentPatientId (patientId: number): void {
//     this.currentDoctorId.next(patientId)
//   }
//   getAppointmentsByPatient (patientId: number): Observable<Appointment[]> {
//     let httpOptions={
//       headers:new HttpHeaders({
//         "Content-Type":"application/json"
//       })     
//     }
//     return this.http.get<Appointment[]>(
//       `https://localhost:7042/api/Appointments/appointments/patient/${patientId}`, httpOptions
//     ) 
//     .pipe(
//       catchError(this.handleError<Appointment[]>('getAppointmentsByPatient'))
//     );
//   }


//   private handleError<T>(operation = 'operation', result?: T) {
//     return (error: any): Observable<T> => {
//       console.error(error);
  
//       this.log(`${operation} failed: ${error.message}`);
//       return of(result as T);
//     };
//   }
  
//   private log(message: string) {
//     console.log(message);
//   }
  
//   }

