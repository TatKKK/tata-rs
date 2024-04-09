import { Component, OnInit, Input, OnDestroy } from '@angular/core'
import { AuthService } from '../../services/auth/auth.service'
import { Doctor } from '../../models/doctor.model'
// import { ChangeDetectorRef } from '@angular/core'
import { AppointmentsService } from '../../services/appointments.service'
import { Appointment } from '../../models/appointment.model'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { Subject, takeUntil } from 'rxjs'


@Component({
  selector: 'app-view-doctor',
  templateUrl: './view-doctor.component.html',
  styleUrl: './view-doctor.component.css'
})
export class ViewDoctorComponent implements OnInit {

  private destroy$ = new Subject<void>();

  token: string = ''
  isAdmin: boolean = false
  userRole!: string;
  userId!: number | null | undefined

  doctor: Doctor | null = null
  doctorId: number | null | undefined

  appointments: Appointment[] = []
  appointment!: Appointment

  Id: number | null = 0  

  display: boolean = true

  closeDialog () {
    this.display = false
  }
  
  constructor (
    public ref: DynamicDialogRef,
    private authService: AuthService,
    // private changeDetectorRef: ChangeDetectorRef,
    public appointmentsService: AppointmentsService,
    public config: DynamicDialogConfig,
    public dialogRef: DynamicDialogRef
  ) {}

  // setUserDetails (token: string): void {
  //   this.authService.setUserRole(token)
  //   this.isAdmin = this.authService.isAdmin()
  //   this.userRole = this.authService.getUserRole()
  // }

  ngOnInit(): void {
    this.Id = this.authService.getUserId();
    console.log(this.Id);
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
      this.userRole = userRole;
    } else {
      this.authService.getUserRole().pipe(takeUntil(this.destroy$)).subscribe(role => {
        this.userRole = role;
        localStorage.setItem('userRole', role);
      });
    }
    this.doctor = this.config.data.doctor;
    this.doctorId = this.config.data.doctorId;
        
    if (this.config.data.appointments) {
      this.appointments = this.config.data.appointments;
      console.log('Appointments passed to dialog:', this.appointments);
    } else {
      console.error('No appointments passed to the dialog.');
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
