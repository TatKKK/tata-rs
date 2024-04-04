import { Component, OnInit } from '@angular/core';
import { Doctor } from '../../models/doctor.model';
import { DoctorsService } from '../../services/doctors.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { AppointmentsService } from '../../services/appointments.service';
import { MessageService} from 'primeng/api';
import { Appointment } from '../../models/appointment.model';
@Component({
  selector: 'app-edit-page-admin',
  templateUrl: './edit-page-admin.component.html',
  styleUrls: ['./edit-page-admin.component.css', 
  '../../components/admin-header/admin-header.component.css']
})
export class EditPageAdminComponent implements OnInit {
  doctorId: number | null = null;

  doctor!: Doctor;
  appointments:Appointment[]=[];

  constructor(private doctorsService: DoctorsService,
    private router:Router,
    private route: ActivatedRoute,
    private auth:AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    public appointmentsService:AppointmentsService,
    private messageService:MessageService) {}

  ngOnInit() {
    if((!this.auth.authenticate) || this.auth.getUserRole() !== 'admin') {
      this.messageService.add({ key: 'tl', severity:'Warn', summary: 'Not Authorized', detail: 'Log in as Admin'});
      return;
    }

    this.route.params.subscribe(params => {
      const id=params['id'];
      if(id){
        this.doctorId=+id;    
        this.doctorsService.getDoctor(this.doctorId).subscribe({
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
      } else {
        console.log('No doctor ID provided in the route');
      }
    });
  }

 
  

}
