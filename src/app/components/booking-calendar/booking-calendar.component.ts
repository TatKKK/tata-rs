import { Component, OnInit, Input, OnDestroy } from '@angular/core'
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { LoginPromptComponent } from '../login-prompt/login-prompt.component'
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component'
import { AuthService } from '../../services/auth/auth.service'
import { Appointment } from '../../models/appointment.model'
import { AppointmentsService } from '../../services/appointments.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Subject, takeUntil } from 'rxjs'
import { Day } from '../../models/appointment.model'
import { ConfirmationService } from 'primeng/api'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-booking-calendar',
  templateUrl: './booking-calendar.component.html',
  styleUrl: './booking-calendar.component.css'
})
export class BookingCalendarComponent implements OnInit {
  //icons
  left = faAngleLeft
  right = faAngleRight

  // private destroy$ = new Subject<void>();

  @Input() doctorId!: number;
  @Input() userId!:number;
  patientId! :number;
  @Input() appointments: Appointment[] = []
  @Input() appointment!: Appointment

  //logged in user id
  @Input() id!: number
  

  days: Day[] = []
  workingHours = Array.from({ length: 9 }, (_, i) => 9 + i) // 9-17
  currentWeekStart: Date = new Date()
  currentDate: Date = new Date()


  // Id=this.authService.getUserId();
  userRole!: string
  isDoctor: boolean = false
  isPatient: boolean = false
  isAdmin: boolean = false
  isLoggedIn: boolean = false
  isDayOff!: boolean

  //dasvenebis dgebi..
  predefinedDayOffs: Date[] = [
    new Date(2024, 3, 9)
  ]

  checkUserRole () {
    this.isDoctor = this.userRole === 'doctor'
    this.isPatient = this.userRole === 'patient'
    this.isAdmin = this.userRole === 'admin'
  }

  ngOnInit () {
    this.appointments;  
    this.initializeDays();   
    this.goToCurrentWeek();    
    this.isLoggedIn = this.authService.isLoggedInSync();            
    this.authService.getUserRole().subscribe(role => {
      this.userRole = role;
    });
   
  }

  constructor (
    private dialogService:DialogService,
    private messageService: MessageService,
    public dialogRef: DynamicDialogRef,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    public appointmentService: AppointmentsService,
    private confirmationService:ConfirmationService
  ) {}

  //kvira
  goToCurrentWeek () {
    const date = new Date()
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) //კვირა
    this.currentWeekStart = new Date(date.setDate(diff))
    this.currentWeekStart.setHours(0, 0, 0, 0)
    this.initializeDays()
  }

  goToNextWeek () {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 1)
    this.currentDate = new Date(this.currentWeekStart)
    this.initializeDays()
  }

  goToPreviousWeek () {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 1)
    this.currentDate = new Date(this.currentWeekStart)
    this.initializeDays()
  }

  goToNextMonth () {
    this.currentWeekStart.setMonth(this.currentWeekStart.getMonth() + 1)
    this.currentWeekStart.setDate(1)
    this.currentDate = new Date(this.currentWeekStart)
    this.initializeDays()
  }
  goToPreviousMonth () {
    this.currentWeekStart.setMonth(this.currentWeekStart.getMonth() - 1)
    this.currentWeekStart.setDate(1)
    this.currentDate = new Date(this.currentWeekStart)
    this.initializeDays()
  }

  initializeDays (): void {
    const startDate = new Date(this.currentWeekStart)
    startDate.setHours(0, 0, 0, 0)
    this.days = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      const isDayOff = this.predefinedDayOffs.some(
        dayOff => dayOff.getTime() === date.getTime()
      )
      const dayAppointments = this.appointments.filter(appointment => {
        const startTime = appointment.StartTime
          ? new Date(appointment.StartTime)
          : null
        return (
          startTime &&
          startTime >= date &&
          startTime <
            new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
        )
      })
      this.days.push({
        date,
        appointments: dayAppointments,
        isWeekend,
        isDayOff
      })
    }
  }

  // //my bookings
  isBookedByMe (day: Day, hour: number): boolean {
    return day.appointments.some(appointment => {
      const appointmentHour = appointment.StartTime?.getHours()
      const isSameHour = appointmentHour === hour
      const isUserAppointment = appointment.PatientId === this.id //logged in user tu eqimia da sxva eqimebs atvalierebs..
      return isSameHour && isUserAppointment
    })
  }

  isBookable (day: Day, hour: number): boolean {
    const isWeekend = day.isWeekend;
    const isDayOff=day.isDayOff;

    const isBooked = day.appointments.some(
      appointment =>
        appointment.StartTime?.getHours() === hour && appointment.IsBooked
    )
    return !isWeekend && !isBooked && !isDayOff
  }

  isAppointmentBooked (day: Day, hour: number): boolean {
    return day.appointments.some(
      appointment =>
        appointment.StartTime?.getHours() === hour && appointment.IsBooked
    )
  }

  getClassForSlot (day: Day, hour: number): string {
    if (this.isBookedByMe(day, hour)) {
      return 'my-booking'
    } else if (this.isAppointmentBooked(day, hour)) {
      return 'booked'
    } else if (day.isWeekend) {
      return 'weekend'
    } else if (day.isDayOff) {
      return 'day-off'}
      else {
      return 'freeSlot'
    }
  }
  openDialogBasedOnAuth(day: Day, hour: number, event: MouseEvent) {
    event.preventDefault();
  
    if (this.isLoggedIn) {
      this.openBookingSubmitDialog(day, hour);
    } else {
      this.openLogDialog();
    }
  }

  openLogDialog() {  
    const ref = this.dialogService.open(LoginPromptComponent, {
      header: 'დასაჯავშნად გთხოვთ გაიაროთ', 
      width: 'fit-content',
      // closable:true,
      dismissableMask: true,
      modal:true
    });

   
    ref.onClose.subscribe(() => {
      this.closeMainDialog(); 
  
    });
}
closeMainDialog(): void {
    if (this.dialogRef) {
        this.dialogRef.close();
    }
}

  openBookingSubmitDialog(day:Day, hour:number){
    this.confirmationService.confirm({
      message:'გსურთ ვიზიტის დაჯავშნა?',
      header:'',
      icon:'',//raato ar gaqra
      acceptLabel: 'დიახ',
      rejectLabel: 'არა',
      
      accept:()=>{
        this.openBookingDialog(day,hour);
      },
      reject: () => {
        this.dialogRef.close();
      }
      
    })
  }
  openBookingDialog(day: Day, hour: number) {
    const ref = this.dialogService.open(BookingDialogComponent, {
      data: {
        day,
        hour,
        doctorId: this.doctorId
      },
      header: 'შეგიძლიათ მიუთითოთ თქვენი პრობლემა',
      width: '27%',
      draggable:true,
      dismissableMask:true,
      styleClass:'app-book'
    });

    ref.onClose.subscribe((notes) => {
      if (notes) {
        this.createAppointment(day, hour, notes);
        this.closeMainDialog();
      }
    });
  }
 
  createAppointment(day: Day, hour: number, notes: string): void {
    const startDate = new Date(day.date);
    startDate.setHours(hour, 0, 0, 0);
    
    const userId = this.authService.getUserId(); 
    console.log("userId", userId);
  
      this.authService.getUserRole().subscribe(role => {
      // let doctorId = null;
      
  
      if (role === 'doctor' && userId !== null) {
        this.doctorId = userId;
      } else if (role === 'patient'&& userId !== null) {
        this.patientId = userId;
        
      } else {
       //admins davamateb
      }
  
      const newAppointment = {
        Id: 0,
        DoctorId: this.doctorId,
        PatientId: this.patientId,
        StartTime: startDate,
        Notes: notes,
        IsBooked: true
      };
  
      console.log('Creating new appointment:', JSON.stringify(newAppointment, null, 2));
  
      this.appointmentService.createAppointment(newAppointment).subscribe({
        next: (appointment) => {
          console.log('Appointment booked successfully:', appointment);
          this.snackBar.open('Appointment booked successfully', 'Close', { duration: 5000 });
          this.refreshAppointments();
        },
        error: (error) => {
          console.error('Error booking appointment:', error);
          this.snackBar.open('Failed to book appointment', 'Close', { duration: 5000 });
        }
      });
    });
  }
  
openDeleteDialog(day:Day, hour:number) {
   this.confirmationService.confirm({
    message: 'გსურთ ჯავშნის წაშლა?',
    acceptLabel:'დიახ',
    rejectLabel:'არა',
    header: '',
    icon: '',
    accept: () => {
      this.onBookedSlotClick(day, hour);
    
    }
  });
}

  onBookedSlotClick (day: Day, hour: number): void {
    // event.preventDefault()
    const appointmentId = this.getAppointmentId(day, hour)
    if (appointmentId) {
      const appointmentToDelete = day.appointments.find(
        a => a.Id === appointmentId
      )
      if (appointmentToDelete) {
        this.deleteAppointment(appointmentToDelete);
        this.refreshAppointments();
        this.dialogRef.close;
      }
    } else {
      console.error('Appointment ID not found for the selected slot.')
    }
  }

  deleteAppointment (appointment: Appointment) {
    this.appointmentService.deleteAppointment(appointment).subscribe({
      next: () => {
        this.messageService.add({severity: 'success',summary: 'Info',detail: 'Successfully deleted',
          life: 2000
        });
        this.refreshAppointments();
      },
      error: error => {
        console.error('Failed to delete appointment:', error)
      }
    })
  }

  getAppointmentId(day: Day, hour: number): number | undefined {
    console.log(`Looking for appointments at hour ${hour} on day`, day);
    const appointment = day.appointments.find(
      a => {
        const appointmentHour = a.StartTime?.getHours();
        console.log(`Comparing against appointment at hour ${appointmentHour}:`, a);
        return appointmentHour === hour && a.IsBooked;
      }
    );
    if (appointment) {
      console.log("Matching appointment found:", appointment);
      return appointment.Id;
    } else {
      console.error("No matching appointment found for hour", hour);
      return undefined;
    }
  }
  
  refreshAppointments() {
    if (this.userId !== null && this.userId !== undefined) {
      this.appointmentService.getAppointmentsByUser(this.userId).subscribe({
        next: appointments => {
          this.appointments = appointments;
        },
        error: error => {
          console.error('Error fetching appointments:', error);
        }
      });
    } else {
      console.error('Cannot fetch appointments, userId is undefined');
    }
  }
  // ngOnDestroy(): void {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }
}
