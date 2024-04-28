import { DoctorDto } from '../models/doctor.model'
import { Doctor } from '../models/doctor.model'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable, of, throwError } from 'rxjs'
import { catchError, map, switchMap, tap } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'
import { SignalRService } from './signal-r.service'
import { Injectable } from '@angular/core'
import { AuthService } from './auth/auth.service'
import { HttpResponse } from '@microsoft/signalr'
import { BehaviorSubject } from 'rxjs'
import { MessageService } from 'primeng/api'

interface PaginatedDoctorResult {
  TotalCount: number
  PageSize: number
  PageNumber: number
  Doctors: Doctor[]
}

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {
  public doctors: DoctorDto[] = []
  public doctorsG: Doctor[] = []

  constructor (
    private messageService: MessageService,
    private http: HttpClient,
    private authService: AuthService,
    private signalRService: SignalRService
  ) {}
  public incrementViewCount (doctorId: number): void {
    this.signalRService.hubConnection
      .invoke('UpdateViewCount', doctorId)
      .catch(err => console.error(err))
  }
  private currentDoctorId = new BehaviorSubject<number | null>(null)
  currentDoctorId$ = this.currentDoctorId.asObservable()

  setCurrentDoctorId (doctorId: number): void {
    this.currentDoctorId.next(doctorId)
  }

  
  get DoctorsList (): Doctor[] {
    return this.doctorsG
  }
  set DoctorsList (list: Doctor[]) {
    this.doctorsG = list
  }

  getDoctors (): Observable<Doctor[]> {
    return this.http
      .get<Doctor[]>(
        'https://localhost:7042/api/Doctors/docs'
      );
  }

  
  getDoctor (id: number): Observable<Doctor> {
    return this.http
      .get<Doctor>(
        `https://localhost:7042/api/Doctors/doctor/${id}`);
  }

  getStars (score: number) {
    return new Array(5).fill(false).map((_, index) => index < score)
  }

  addDoctor (formData: any): Observable<any> {
    return this.http
      .post<any>('https://localhost:7042/api/Doctors', formData);
  }

  editDoctor(id: number, doctorData:any): Observable<any> {    

    return this.http.put(`https://localhost:7042/api/Doctors/${id}`, JSON.stringify(doctorData));
  }

  deleteDoctor (doctor: Doctor): Observable<any> {    
    return this.http.delete<any>(`https://localhost:7042/api/Doctors/deletedoctor/${doctor.Id}`);
  }

 
  getDoctorsByCategory (category: string): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(
      `https://localhost:7042/api/Doctors/category/${category}`
    )
  }
  private _paginatedDoctorsResult!: PaginatedDoctorResult
  get PaginatedDoctorsResult (): PaginatedDoctorResult {
    return this._paginatedDoctorsResult
  }
  set PaginatedDoctorsResult (value: PaginatedDoctorResult) {
    this._paginatedDoctorsResult = value
  }
  getDoctorsPaginated(
    pageNumber: number = 1,
    pageSize: number = 6
  ): Observable<PaginatedDoctorResult> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    let httpOptions = {
      params: params
    };
  
    return this.http.get<PaginatedDoctorResult>(
      'https://localhost:7042/api/Doctors/docsPaginate',httpOptions);
  }
  

  refreshDoctors (): void {
    this.getDoctors().subscribe(doctors => {
      this.DoctorsList = doctors
    })
  }
}
