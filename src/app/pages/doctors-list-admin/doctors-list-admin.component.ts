import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { DoctorsService } from '../../services/doctors.service';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { Doctor } from '../../models/doctor.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-doctors-list-admin',
  templateUrl: './doctors-list-admin.component.html',
  styleUrl: './doctors-list-admin.component.css',
})
export class DoctorsListAdminComponent implements OnInit {

  
  faEdit=faEdit;
  faDelete=faDeleteLeft;

  doctors: Doctor[] = [];
  

  ngOnInit(): void {  
    this.doctorsService.getDoctors().subscribe({
      next: (doctors: Doctor[]) => {
        this.doctors = doctors;
      },
      error: (error) => {
        console.error('Error fetching doctors:', error);
      }
    });     
  } 
  constructor(
    private route: ActivatedRoute,
    public doctorsService: DoctorsService,
    private authService:AuthService
  ) {}

  
  
  
  ngAfterViewInit(): void{
    this.doctorsService.getDoctors();
  }
  
  getStars(score: number | undefined) {
    const validScore = score ?? 1;
    return new Array(5).fill(false).map((_, index) => index < validScore);    
}

deleteDoctor(doctor:Doctor):void{
  if (!this.authService.isAdmin()) {
    alert('Only admin can delete');
    return;
  }
  this.doctorsService.deleteDoctor(doctor).subscribe({
    next:()=>{
      this.doctorsService.doctors=this.doctorsService.doctors.filter(doc=>doc.id!==doctor.Id);
    },
    error:(error)=>{
      console.error('Error deleting doctor:', error);
    }
  })
}

editDoctors(doctor:Doctor):void{
  if (!this.authService.isAdmin()) {
    alert('Only admin can edit');
    return;
  }
    this.doctorsService.editDoctor(doctor).subscribe({
    next:()=>{
      this.doctorsService.doctors=this.doctorsService.doctors.filter(doc=>doc.id! == doctor.Id);
    },
    error:(error)=>{
      console.error('Error editing doctor:', error);
    }
  })

}
}
