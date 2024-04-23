import { Component, OnInit, Input, OnDestroy } from '@angular/core'
import { AuthService } from '../../services/auth/auth.service'
import { Doctor } from '../../models/doctor.model'
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
    public appointmentsService: AppointmentsService,
    public config: DynamicDialogConfig,
    public dialogRef: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    const idString = localStorage.getItem('userId');
this.Id = idString !== null ? parseInt(idString, 10) : null 
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
    } else {
      console.error('No appointments passed to the dialog.');
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
