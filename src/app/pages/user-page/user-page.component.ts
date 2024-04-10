import { Component, OnInit, OnDestroy } from '@angular/core'
import { AuthService } from '../../services/auth/auth.service'
import { AppointmentsService } from '../../services/appointments.service'
import { Doctor } from '../../models/doctor.model'
import { ActivatedRoute } from '@angular/router'

import { ChangeDetectorRef } from '@angular/core'
import { UserService } from '../../services/user.service'
import { Patient } from '../../models/patient.model'
import { User } from '../../models/user.model'
import { Appointment } from '../../models/appointment.model'
import { Subject, takeUntil } from 'rxjs'

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent implements OnInit {

  Id: number | null = 0  
  userId: number | null = null
  userRole!: string
  isDoctor: boolean = false
  isPatient: boolean = false
  isAdmin: boolean = false

  doctorId: number = 0
  patientId: number = 0

  doctor!: Doctor
  patient!: Patient
  user: User = new User()
  appointments: Appointment[] = []

  private destroy$ = new Subject<void>();


  constructor (
    private authService: AuthService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    public appointmentsService: AppointmentsService,
    public users: UserService
  ) {}


  checkUserRole () {
    this.isDoctor = this.userRole === 'doctor'
    this.isPatient = this.userRole === 'patient'
    this.isAdmin = this.userRole === 'admin'
  }
  
  ngOnInit (): void {
    
  this.Id = this.authService.getUserId();
  console.log(this.Id);

    this.userId = this.authService.getUserId();
    this.authService.getUserRole().pipe(takeUntil(this.destroy$)).subscribe(role => {
      this.userRole = role;
    });

    
  this.checkUserRole();

  const storedUser = localStorage.getItem('user');
  const storedAppointments = localStorage.getItem('appointments');

  if (storedUser) {
    this.user = JSON.parse(storedUser);
  }

  if (storedAppointments) {
    const parsedAppointments: any[] = JSON.parse(storedAppointments);
  
    this.appointments = parsedAppointments.map(appointment => ({
      ...appointment,
     
      StartTime: typeof appointment.StartTime === 'string' ? new Date(appointment.StartTime) : appointment.StartTime,
    }));
    
    this.totalAppointments = this.appointments.length;
  }
  
  

    this.route.params.subscribe(params => {
      const email = params['email']
      if (email) {
        this.fetchUserAndAppointments(email);
        console.log('appointments from userpage:', this.appointments);
      } else {
        console.log('No email provided in the route')
      }
    })
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  
  private fetchUserAndAppointments (email: string): void {
    this.users.getUserByEmail(email).subscribe({
      next: user => {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        this.changeDetectorRef.detectChanges()
        if (user && user.Id) {
          this.fetchAppointments(user.Id)
        }
      },
      error: err => console.error('Failed to fetch user', err)
    })
  }
  

  private fetchAppointments (userId: number): void {
    this.appointmentsService.getAppointmentsByUser(userId).subscribe({
      next: appointments => {
        this.appointments = appointments;
        this.totalAppointments = appointments.length;
        localStorage.setItem('appointments', JSON.stringify(appointments));
      },
      error: err => console.error('Error fetching appointments:', err)
    })
  }

  

  totalAppointments: number = 0

  // getToTal (): void {
  //   if (this.userId) {
  //     this.appointmentsService.getAppointmentsByUser(this.userId).subscribe({
  //       next: appointments => {
  //         this.totalAppointments = appointments.length
  //         console.log(appointments)
  //         console.log('total appointments')
  //       },
  //       error: err => {
  //         console.error('Error fetching appointments:', err)
  //       }
  //     })
  //   }
  // }


}
