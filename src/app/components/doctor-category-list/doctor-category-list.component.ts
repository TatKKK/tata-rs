import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { DoctorsService } from '../../services/doctors.service'
import { Doctor } from '../../models/doctor.model'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons'
import { AuthService } from '../../services/auth/auth.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MessageService } from 'primeng/api'
import { Router } from '@angular/router'

@Component({
  selector: 'app-doctor-category-list',
  templateUrl: './doctor-category-list.component.html',
  styleUrl: './doctor-category-list.component.css'
})
export class DoctorCategoryListComponent implements OnInit {
  faEdit = faEdit
  faDelete = faDeleteLeft
  doctors: Doctor[] = []
  category!: string
  doctorData:any;

  userRole: string = ''

  constructor (
    private route: ActivatedRoute,
    private router: Router,
    public doctorsService: DoctorsService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private messageService: MessageService
  ) {}

  ngOnInit (): void {
    const category = this.route.snapshot.paramMap.get('category')
    const userRole = localStorage.getItem('userRole')
    if (userRole) {
      this.userRole = userRole
    } else {
      this.authService.getUserRole().subscribe(role => {
        this.userRole = role
        localStorage.setItem('userRole', role)
      })
    }
    if (category) {
      this.category = category
      this.doctorsService.getDoctorsByCategory(this.category).subscribe({
        next: (doctors: Doctor[]) => {
          this.doctors = doctors
        },
        error: error => {
          console.error('Error fetching doctors by category:', error)
        }
      })
    } else {
      console.log('category is empty')
    }
  }

  getStars (score: number | undefined) {
    const validScore = score ?? 1
    return new Array(5).fill(false).map((_, index) => index < validScore)
  }

  deleteDoctor (doctor: Doctor, event: Event): void {
    if (this.userRole !== 'admin') {
      this.messageService.add({
        key: 'tl',
        severity: 'info',
        summary: 'Unauthorized',
        detail: 'Login as admin',
        life: 2000
      })
    }
    this.doctorsService.deleteDoctor(doctor).subscribe({
      next: () => {
        this.doctorsService.doctors = this.doctorsService.doctors.filter(
          doc => doc.id !== doctor.Id
        );
        this.messageService.add({
          key: 'tl',
          severity: 'info',
          summary: 'Deleted',
          detail: 'Deleted',
          life: 2000
        })
      },
      error: error => {
        console.error('Error deleting doctor:', error)
      }
    })
  }

  editDoctors (doctor: Doctor, event: Event): void {
    if (this.userRole !== 'admin') {
      event.preventDefault()
      this.messageService.add({
        key: 'tl',
        severity: 'info',
        summary: 'Unauthorized',
        detail: 'Log in as admin',
        life: 2000
      })
    } else {
      this.router.navigate(['/editPage', doctor.Id])
    }
    if(doctor.Id){
      this.doctorsService.editDoctor(doctor.Id, this.doctorData).subscribe({
        next: () => {
          this.doctorsService.doctors = this.doctorsService.doctors.filter(
            doc => doc.id! == doctor.Id
          )
        },
        error: error => {
          console.error('Error editing doctor:', error)
        }
      })
    }
  }

  
}
