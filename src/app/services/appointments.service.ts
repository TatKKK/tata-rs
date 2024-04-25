import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Appointment } from '../models/appointment.model'
import { Observable, BehaviorSubject, catchError, of } from 'rxjs'
import { map } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
public appointments:Appointment[]=[];
  constructor(private http:HttpClient,
              private authService:AuthService){
  }

  private currentUserId = new BehaviorSubject<number|null>(null);
  currentUserId$ = new BehaviorSubject<number|null>(null);

  setCurrentUserId(userId:number):void{
    this.currentUserId.next(userId);
  }

  private currentDoctorId = new BehaviorSubject<number | null>(null)
  currentDoctorId$ = this.currentDoctorId.asObservable()

  setCurrentDoctorId (doctorId: number): void {
    this.currentDoctorId.next(doctorId)
  }

  private currentPatientId = new BehaviorSubject<number | null>(null)
  currentPatientId$ = this.currentPatientId.asObservable()

  setCurrentPatientId (patientId: number): void {
    this.currentPatientId.next(patientId)
  }

  

  private apiUrl = "https://localhost:7042/api/Appointments";

  createAppointment(newAppointment:Appointment): Observable<Appointment> {
      let token=this.authService.getToken();    
      if(!this.authService.getToken()){
        console.log('No Token');
      }
      let httpOptions={
        headers:new HttpHeaders({
          'Authorization':`Bearer ${token}`
        })
      };

    return this.http.post<Appointment>(`${this.apiUrl}/create`, newAppointment, httpOptions);
  }

  updateAppointmentStatus(appointment: Appointment, id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, appointment);
  }

  deleteAppointment(appointment:Appointment): Observable<any> {
    let token = this.authService.getToken();
    if(!this.authService.getToken()){
      console.log('No Token');
    }
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
    return this.http.delete(`${this.apiUrl}/delete/${appointment.Id}`, httpOptions);
  }

  getAppointmentsByUser(userId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`https://localhost:7042/api/Appointments/users/${userId}`).pipe(
      map(appointments => appointments.map(a => {
        if (a.StartTime) {
          a.StartTime = new Date(a.StartTime+'Z');
        }
        if (a.EndTime) {
          a.EndTime = new Date(a.EndTime+'Z');
        }
        return a;
      }))
    );
  }
  getAppointmentsByDoctor(doctorId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`https://localhost:7042/api/Appointments/doctor/${doctorId}`).pipe(
      map(appointments => appointments.map(a => {
        if (a.StartTime) {
          a.StartTime = new Date(a.StartTime+'Z');
        }
        if (a.EndTime) {
          a.EndTime = new Date(a.EndTime +'Z');
        }
        return a;
      }))
    );
  }

  getAppointmentsByPatient(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`https://localhost:7042/api/Appointments/patient/${patientId}`).pipe(
      map(appointments => appointments.map(a => {
        if (a.StartTime) {
          a.StartTime = new Date(a.StartTime+'Z');
        }
        if (a.EndTime) {
          a.EndTime = new Date(a.EndTime+'Z');
        }
        return a;
      }))
    );
  }
  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/Get_Appointments`).pipe(
      map(appointments => appointments.map(a => {
        if (a.StartTime) {
          a.StartTime = new Date(a.StartTime + 'Z');
        }
        if (a.EndTime) {
          a.EndTime = new Date(a.EndTime+'Z');
        }
        return a;
      }))
    );
  }

  getTotal(){
    return this.getAppointmentsByUser.length;
  }
  
  getCurrentDoctorId(): number | null {
    return this.currentDoctorId.value;
  }
  
  getCurrentPatientId(): number | null {
    return this.currentPatientId.value;
  }

  getCurrentUserId():number|null{
    return this.currentUserId.value;
  }
  
}
