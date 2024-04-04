import { Component, OnInit } from '@angular/core'
import { AuthService } from '../../services/auth/auth.service'
import { AppointmentsService } from '../../services/appointments.service'
import { Doctor } from '../../models/doctor.model'
import { ActivatedRoute } from '@angular/router'

import { ChangeDetectorRef } from '@angular/core'
import { UserService } from '../../services/user.service'
import { Patient } from '../../models/patient.model'
import { User } from '../../models/user.model'
import { Appointment } from '../../models/appointment.model'

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent implements OnInit {
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
  // setUserDetails(token: string): void {
  //   this.authService.setUserRole(token);
  //   this.isAdmin = this.authService.isAdmin();
  //   this.userRole = this.authService.getUserRole();
  // }

  ngOnInit (): void {
    this.userId = this.authService.getUserId()

    this.userRole = this.authService.getUserRole()
    this.checkUserRole()

    this.route.params.subscribe(params => {
      const email = params['email']
      if (email) {
        this.fetchUserAndAppointments(email)
      } else {
        console.log('No email provided in the route')
      }
    })
  }

  private fetchUserAndAppointments (email: string): void {
    this.users.getUserByEmail(email).subscribe({
      next: user => {
        this.user = user
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
        this.appointments = appointments
        this.totalAppointments = appointments.length
      },
      error: err => console.error('Error fetching appointments:', err)
    })
  }

  // private checkUserRole(): void {
  //   this.isDoctor = this.userRole === 'doctor';
  //   this.isPatient = this.userRole === 'patient';
  //   this.isAdmin = this.userRole === 'admin';
  // }

  totalAppointments: number = 0

  getToTal (): void {
    if (this.userId) {
      this.appointmentsService.getAppointmentsByUser(this.userId).subscribe({
        next: appointments => {
          this.totalAppointments = appointments.length
          console.log(appointments)
          console.log('total appointments')
        },
        error: err => {
          console.error('Error fetching appointments:', err)
        }
      })
    }
  }
}
