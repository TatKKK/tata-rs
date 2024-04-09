import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { DoctorsService } from '../../services/doctors.service';
import { AppointmentsService } from '../../services/appointments.service';
import { Doctor } from '../../models/doctor.model';
import { Appointment } from '../../models/appointment.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-doctor-general-view',
  templateUrl: './doctor-general-view.component.html',
  styleUrl: './doctor-general-view.component.css'
})
export class DoctorGeneralViewComponent implements OnInit {

  token:string="";  
  isAdmin:boolean=false;  
  userRole:string='';
  userId!:number;

   doctorId: number | null = null;

  doctor!: Doctor;
  appointments:Appointment[]=[];
  appointment!:Appointment;
  Id:number | null | undefined;

  
constructor( private authService:AuthService,
  private route:ActivatedRoute,
  private doctorsService:DoctorsService,
  public appointmentsService:AppointmentsService){  
}

ngOnInit(): void {
  
  this.Id=this.authService.getUserId();
  this.route.params.subscribe(params => {
    const id = params['id'];
    if (id) {
      this.doctorId = +id;
      this.fetchDoctorAndAppointments(this.doctorId);
    } else {
      console.log('No doctor ID provided in the route');
    }
  });
}

private fetchDoctorAndAppointments(doctorId: number): void {
  this.doctorsService.getDoctor(doctorId).subscribe({
    next: (doctor) => {
      this.doctor = doctor;
      if (doctor?.Id) {
        this.appointmentsService.getAppointmentsByDoctor(doctor.Id).subscribe({
          next: (appointments) => {
            this.appointments = appointments;
          },
          error: (err) => console.error('Error fetching appointments', err),
        });
      }
    },
    error: (err) => console.error('Failed to fetch doctor', err),
  });
}

}
