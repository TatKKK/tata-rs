import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { DoctorsService } from '../../services/doctors.service';
import { Doctor } from '../../models/doctor.model';
import { ChangeDetectorRef } from '@angular/core';
import { AppointmentsService } from '../../services/appointments.service';
import { Appointment } from '../../models/appointment.model';
import { Day } from '../../models/appointment.model';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';


@Component({
  selector: 'app-view-doctor',
  templateUrl: './view-doctor.component.html',
  styleUrl: './view-doctor.component.css'
})
export class ViewDoctorComponent implements OnInit {  
  token:string="";  
  isAdmin:boolean=false;  
  userRole:string='';
  userId!:number | null | undefined;

  doctor: Doctor | null = null;
  doctorId:number | null | undefined;

 appointments:Appointment[]=[];
  appointment!:Appointment;

  Id:number | null =0;


  /* dialog */

  display: boolean = true;

closeDialog() {
  this.display = false;
}
/*-------------------- */  
constructor( 
  public ref: DynamicDialogRef ,
  private authService:AuthService,
  private doctorsService:DoctorsService,
  private changeDetectorRef: ChangeDetectorRef,
  public appointmentsService:AppointmentsService,
  public config:DynamicDialogConfig,
  public dialogRef: DynamicDialogRef,){  
   
}

setUserDetails(token: string): void {
  this.authService.setUserRole(token); 
  this.isAdmin = this.authService.isAdmin();
  this.userRole = this.authService.getUserRole();  
}

ngOnInit(): void {    

    this.Id = this.authService.getUserId();
  
  this.userRole = this.authService.getUserRole();
    this.doctor = this.config.data.doctor;
    this.doctorId = this.config.data.doctor.Id;   
  if (this.doctorId)  {
      this.fetchDoctorAndAppointments(this.doctorId);
  } else {
    console.error("No selected doctor to fetch appointments for.");
  }
  console.log("Selected Doctor ID:", this.doctorId);
}

private fetchDoctorAndAppointments(doctorId: number): void {
  this.doctorsService.getDoctor(doctorId).subscribe({
    next: (doctor) => {
      this.doctor = doctor;
      this.changeDetectorRef.detectChanges();
      if (doctor?.Id) {
        this.appointmentsService.getAppointmentsByDoctor(doctor.Id).subscribe({
          next: (appointments) => {
            this.appointments = appointments;
            this.changeDetectorRef.detectChanges();
            console.log("APPOINTMENTS?",appointments); 
          },
          error: (err) => console.error('Error fetching appointments', err),
        });
      }
    },
    error: (err) => console.error('Failed to fetch doctor', err),
  });
}



}