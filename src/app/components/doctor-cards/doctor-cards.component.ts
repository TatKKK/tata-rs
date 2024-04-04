import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { DoctorsService } from '../../services/doctors.service'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { SignalRService } from '../../services/signal-r.service'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { Doctor } from '../../models/doctor.model'
import { FilterService } from '../../services/filter.service'
import { MatDialog } from '@angular/material/dialog'
import { AuthService } from '../../services/auth/auth.service'
import { Router } from '@angular/router'
import { MatDialogConfig } from '@angular/material/dialog'
import { ViewDoctorComponent } from '../../pages/view-doctor/view-doctor.component'
import { DialogService } from 'primeng/dynamicdialog'
import { Appointment } from '../../models/appointment.model'

interface PaginatedDoctorResult {
  TotalCount: number
  PageSize: number
  PageNumber: number
  Doctors: Doctor[]
}

@Component({
  selector: 'app-doctor-cards',
  templateUrl: './doctor-cards.component.html',
  styleUrl: './doctor-cards.component.css'
})
export class DoctorCardsComponent implements OnInit {
  faEye = faEye
  faAngleRight = faAngleRight

  currentPage: number = 1
  pageSize: number = 6
  pageNumber: number = 1
  totalCount: number = 0
  doctors: Doctor[] = []
  doctorId!:number;

  display: boolean = true;
  doctor:Doctor | null = null;
  // selectedDoctor:Doctor |null=null;

  filteredDoctors: Doctor[] = []


  token:string="";  
  isAdmin:boolean=false;  
  userRole:string='';
  userId!:number;

 
  // doctorId: number | null = null;
  appointments:Appointment[]=[];
  appointment!:Appointment;
  Id:number | null | undefined;

  ngOnInit (): void {
    this.signalRService.startConnection()
    this.signalRService.addViewCountListener(this.updateViewCount)
    this.subscribeToFilterChanges()
    this.loadDoctorsPaginated(this.currentPage, this.pageSize)
  }
  constructor (
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public doctorsService: DoctorsService,
    private signalRService: SignalRService,
    public filterService: FilterService,
    private dialogService: DialogService
  ) {}

  // openDoctorDialog(doctor: Doctor, event:MouseEvent): void {
  //   const dialogConfig = new MatDialogConfig();

  //   dialogConfig.disableClose = false;
  //   dialogConfig.autoFocus = true;
  //   data: { id: doctor.Id }

  //   this.dialog.open(ViewDoctorDialogComponent, dialogConfig);

  //   event.preventDefault();
  //   dialogConfig.position = {
  //     'top': '0',
  //     left: '0'
  // };}
 totalPages: number = 0
  subscribeToFilterChanges (): void {
    this.filterService.currentFilter.subscribe(filterTerm => {
      this.applyFilter(filterTerm)
    })
  }

  applyFilter (filterTerm: string): void {
    if (!filterTerm) {
      this.filteredDoctors = this.doctors
    } else {
      const filterWords = filterTerm.toLowerCase().split(/\s+/)

      this.filteredDoctors = this.doctors.filter(doctor => {
        const doctorFname = doctor.Fname?.toLowerCase() || ''
        const doctorCategory = (doctor.Category || '').toLowerCase()

        return filterWords.some(
          word => doctorFname.includes(word) || doctorCategory.includes(word)
        )
      })
    }

    const isDataFound = this.filteredDoctors.length > 0

    this.filterService.updateDataFoundState(isDataFound)

    this.cdr.detectChanges()
  }

  loadDoctorsPaginated (pageNumber: number, pageSize: number): void {
    this.doctorsService.getDoctorsPaginated(pageNumber, pageSize).subscribe({
      next: (result: PaginatedDoctorResult) => {
        console.log(result)
        this.doctors = result.Doctors
        this.totalCount = result.TotalCount
        this.currentPage = pageNumber
        this.totalPages = Math.ceil(this.totalCount / this.pageSize)

        this.applyFilter(this.filterService.filterTermSource.getValue())
      },
      error: error => {
        console.error('Error fetching doctors:', error)
      }
    })
  }

  public updateViewCount = (doctorId: number, viewCount: number) => {
    const doctor = this.doctorsService.DoctorsList.find(d => d.Id === doctorId)
    if (doctor) {
      doctor.ViewCount = viewCount
    }
  }

  getStars (score: number | undefined) {
    const validScore = score ?? 1
    return new Array(5).fill(false).map((_, index) => index < validScore)
  }

  incrementViewCount (doctorId: number | null): void {
    if (doctorId === null) {
      console.warn('Cannot increment view count: doctor ID is null')
      return
    }
    this.doctorsService.incrementViewCount(doctorId)
  }

  loadNextPage (): void {
    if (this.currentPage * this.pageSize < this.totalCount) {
      this.loadDoctorsPaginated(++this.currentPage, this.pageSize)
    }
  }

  handleClick (doctor: Doctor, event: MouseEvent): void {
    event.preventDefault();
    this.doctor = doctor;
    this.incrementViewCount(doctor.Id!);
this.openDoctorDialog(doctor);  
  }
  openDoctorDialog(doctor:Doctor) {
    console.log("Opening dialog:", doctor);
    const ref = this.dialogService.open(ViewDoctorComponent, {
      data: {
        doctor: this.doctor
      },
      header: '',
      width: '70%',
      contentStyle: {"max-height": "100vh", "overflow": "auto"},
      draggable:true,
      resizable:true
    });
  
    ref.onClose.subscribe((result) => {
     
    });
  }
  
  closeDialog():void{
    this.display=false;
  }
}
