import { Component, Input } from '@angular/core';
import { DoctorsService } from '../../services/doctors.service';
import { Doctor } from '../../models/doctor.model';
import { AppointmentsService } from '../../services/appointments.service';
import { ChangeDetectorRef } from '@angular/core';
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

  
  isEditMode: boolean = false;

  toggleEditMode(): void {
    console.log('toggled?');
    this.isEditMode = !this.isEditMode;
  }
  
  constructor(
    private auth:AuthService,
    private doctorsService: DoctorsService,
    public appointmentsService: AppointmentsService,
    private changeDetectorRef: ChangeDetectorRef,
    
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

  editDoctor(doctor:Doctor):void{
    this.doctorsService.editDoctor(doctor).subscribe({
      next:()=>{
        this.doctorsService.doctors=this.doctorsService.doctors.filter(doc=>doc.id!==doctor.Id);
        this.doctorsService.refreshDoctors();
      },
      error:(error)=>{
        console.error('Error deleting doctor:', error);
      }
    })
  }

}