import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { DoctorsService } from '../../services/doctors.service'
import { Doctor } from '../../models/doctor.model'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons'
import { AuthService } from '../../services/auth/auth.service'
import { throwError } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MessageService } from 'primeng/api'

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

  userRole: string = ''

  constructor (
    private route: ActivatedRoute,
    public doctorsService: DoctorsService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private messageService: MessageService
  ) {}

  ngOnInit (): void {
    const category = this.route.snapshot.paramMap.get('category')
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

  deleteDoctor (doctor: Doctor): void {
    if (!this.authService.isAdmin()) {
      this.snackBar.open(
        ` Log in as admin;`,
        'Close',
        {
          duration: 5000
        }
      )
      return
    }
    this.doctorsService.deleteDoctor(doctor).subscribe({
      next: () => {
        this.doctorsService.doctors = this.doctorsService.doctors.filter(
          doc => doc.id !== doctor.Id
        )
      },
      error: error => {
        console.error('Error deleting doctor:', error)
      }
    })
  }
  authorizationWarning() {
    this.messageService.add({
      key:'tl',
      severity: 'Warn',
      summary: 'Info Message',
      detail: 'Authorization required',
      life: 2000
    });
  }
  
  openSnackBar1 (message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    })
  }

  editDoctors (doctor: Doctor): void {
    if (!this.authService.isAdmin()) {
      this.snackBar.open(` Log in as admin`, 'Close', {
        duration: 5000
      })

      return
    }
    this.doctorsService.editDoctor(doctor).subscribe({
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
