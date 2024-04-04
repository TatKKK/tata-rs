import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { AppointmentsService } from '../../services/appointments.service';
import { AuthService } from '../../services/auth/auth.service';


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

  role:String='';
  
 

  constructor(public appointmentsService:AppointmentsService,
    private authService:AuthService ){
  }
  ngOnInit(): void {
    this.role=this.authService.getUserRole();
    if (this.user&&this.userId !==null && this. userId !== undefined) {
      this.appointmentsService.setCurrentUserId(this.userId);     
    }
  }


 

//   totalAppointments: number = 0;

//   getToTal(): void {
//    if (this.userId) {
//      this.appointmentsService.getAppointmentsByUser(this.userId).subscribe({
//        next: (appointments) => {
//          this.totalAppointments = appointments.length;
//        },
//        error: (err) => {
//          console.error('Error fetching appointments:', err);
//        }
//      });
//    }
//  }

}
