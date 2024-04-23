import { Component, Input } from '@angular/core';
import { DoctorsService } from '../../services/doctors.service';
import { Doctor } from '../../models/doctor.model';
import { AppointmentsService } from '../../services/appointments.service';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-doctor-admin',
  templateUrl: './doctor-admin.component.html',
  styleUrl: './doctor-admin.component.css'
})
export class DoctorAdminComponent {
  @Input() doctor!: Doctor;
@Input() doctorId!:number;
@Input() userId!:number;

selectedDoctor!:Doctor;

  
  isEditMode: boolean = false;

  
  constructor(
    private auth:AuthService,
    private doctorsService: DoctorsService,
    public appointmentsService: AppointmentsService,    
  ){}

  ngOnInit(): void {
    if (this.doctor && this.doctor.Id !== undefined && this.doctor.Id !== null) {
      this.appointmentsService.setCurrentDoctorId(this.doctor.Id);
    } 
  }
  
  getStars(score: number | undefined) {
      const validScore = score ?? 1;
      return new Array(5).fill(false).map((_, index) => index < validScore);
  }

  getTotal():number{
    return this.appointmentsService.getAppointmentsByDoctor.length;
  }

  deleteDoctor(doctor:Doctor):void{
    this.doctorsService.deleteDoctor(doctor).subscribe({
      next:()=>{
        this.doctorsService.doctors=this.doctorsService.doctors.filter(doc=>doc.id!==doctor.Id);
        this.doctorsService.refreshDoctors();
      },
      error:(error)=>{
        console.error('Error deleting doctor:', error);
      }
    })
  }
  toggleEditMode(event?: Event): void {
    console.log('Edit mode toggled');
    if (event) {
      event.stopPropagation();
    }
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.saveDoctorChanges();
    }
  }
  
  saveDoctorChanges(): void {
    const doctorData = {
      Fname: this.selectedDoctor.Fname ?? '',
      Lname: this.selectedDoctor.Lname ?? '',
      Email: this.selectedDoctor.Email ?? '',
      IdNumber: this.selectedDoctor.IdNumber ?? ''
    };
    
    if (this.selectedDoctor.Id) {
      this.doctorsService.editDoctor(this.selectedDoctor.Id, doctorData)
        .subscribe({
          next: (response) => {
            console.log('Doctor updated successfully!', response);
          },
          error: (error) => {
            console.error('Failed to update doctor', error);
          }
        });
    }
  }
  
  
  
  

}