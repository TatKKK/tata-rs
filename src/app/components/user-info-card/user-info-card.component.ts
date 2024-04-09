import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { AppointmentsService } from '../../services/appointments.service';
import { AuthService } from '../../services/auth/auth.service';
import { Doctor } from '../../models/doctor.model';
import { DoctorsService } from '../../services/doctors.service';

@Component({
  selector: 'app-user-info-card',
  templateUrl: './user-info-card.component.html',
  styleUrl: './user-info-card.component.css'
})
export class UserInfoCardComponent implements OnInit {
  // @Input() email!:string;
  @Input() userId?:number;
  @Input() user!:User;
  @Input() totalAppointments!:number;

  doctor!:Doctor 


  userRole!:string;
  
   constructor(
    public appointmentsService:AppointmentsService,
    private authService:AuthService ,
    private doctorsService:DoctorsService
  ){
  }
  ngOnInit(): void {
    this.authService.getUserRole().subscribe(role => {
      this.userRole = role;
    });
    if (this.user&&this.userId !==null && this. userId !== undefined) {
      this.appointmentsService.setCurrentUserId(this.userId);     
      this.doctorsService.getDoctor(this.userId);
    }
  }

  getStars(score: number | undefined) {
    const validScore = score ?? 1;
    return new Array(5).fill(false).map((_, index) => index < validScore);
  }
 

}
