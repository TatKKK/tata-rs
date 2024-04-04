import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from '../../services/appointments.service';
import { Appointment } from '../../models/appointment.model';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-mat-dialog',
  templateUrl: './mat-dialog.component.html',
  styleUrl: './mat-dialog.component.css'
})
export class MatDialogComponent implements OnInit {
  isLoggedIn: boolean = false;
  role: string = '';
  userId: number | null = null;

  constructor(
    private appointmentService: AppointmentsService,
    private authService: AuthService,
    private router: Router 
  ){}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.initializeForLoggedInUser();
      } else {
        this.openLogDialog();
      }
    });
  }
  
  initializeForLoggedInUser(): void {
    this.role = this.authService.getUserRole();
    this.userId = this.authService.getUserId();
  
    if (this.userId !== null) {
      if (this.role === 'doctor') {
        this.appointmentService.setCurrentDoctorId(this.userId);
        console.log(this.userId);
      } else if (this.role === 'patient') {
        this.appointmentService.setCurrentPatientId(this.userId);
      } else if (this.role === 'admin'){
        console.log(this.userId);
        this.appointmentService.setCurrentDoctorId(85);
        this.appointmentService.setCurrentPatientId(182);
      }
    } else {
      console.error('User ID is null, navigating to login');
      this.router.navigate(['/']);
    }
  }

  appointment = new Appointment(new Date());

  bookAppointment(): void {
    if (this.appointment.DoctorId && this.appointment.PatientId) {
      this.appointmentService.createAppointment(this.appointment).subscribe({
        next: (data) => {
          console.log('Appointment booked successfully:', data);
        },
        error: (error) => {
          console.error('There was an error booking the appointment', error);
        }
      });
    } else {
      console.log('Doctor ID or Patient ID is missing.');
    }
  }

  openLogDialog(): void {
    console.log('Redirecting to login dialog...');
  }
}