import { Component, OnInit, OnDestroy } from '@angular/core'
import { AuthService } from '../../services/auth/auth.service'
import { AppointmentsService } from '../../services/appointments.service'
import { ActivatedRoute } from '@angular/router'
import { UserService } from '../../services/user.service'
import { User } from '../../models/user.model'
import { Appointment } from '../../models/appointment.model'
import { Subject, takeUntil } from 'rxjs'
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent implements OnInit {
  userId: number | null = null;
  userRole: string = '';
  isDoctor: boolean = false;
  isPatient: boolean = false;
  isAdmin: boolean = false;

  user: User = {}; 
  appointments: Appointment[] = []; 
  totalAppointments: number = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    public appointmentsService: AppointmentsService,
    public userService: UserService,
  ) {}
  ngOnInit(): void {
    this.userId = this.parseUserIdFromLocalStorage();
    this.userRole = localStorage.getItem('userRole') || 'unknown';
    this.checkUserRole();
  
    this.route.params.pipe(
      switchMap(params => {
        const userId = parseInt(params['userId'], 10); 
        if (isNaN(userId)) {
          console.error('Invalid user ID provided in the route');
          return []; 
        }
        this.userId = userId;
        return this.userService.getUser(this.userId);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: user => {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        if (user && user.Id) {
          this.fetchAppointments(user.Id);
        }
      },
      error: err => console.error('Failed to fetch user', err)
    });
  }
  
  private parseUserIdFromLocalStorage(): number | null {
    const userIdString = localStorage.getItem('userId');
    return userIdString !== null ? parseInt(userIdString, 10) : null;
  }
  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkUserRole(): void {
    this.isDoctor = this.userRole === 'doctor';
    this.isPatient = this.userRole === 'patient';
    this.isAdmin = this.userRole === 'admin';
  }

  
  private fetchAppointments(userId: number): void {
    this.appointmentsService.getAppointmentsByUser(userId).subscribe({
      next: appointments => {
        this.appointments = appointments;
        this.totalAppointments = appointments.length;
        localStorage.setItem('appointments', JSON.stringify(appointments));
      },
      error: err => console.error('Error fetching appointments:', err)
    });
  }
}
