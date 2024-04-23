import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { AuthService } from '../../services/auth/auth.service'
import { DoctorsService } from '../../services/doctors.service'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons'
import { Doctor } from '../../models/doctor.model'
import { MessageService } from 'primeng/api'
import { AppointmentsService } from '../../services/appointments.service'

@Component({
  selector: 'app-doctors-list-admin',
  templateUrl: './doctors-list-admin.component.html',
  styleUrl: './doctors-list-admin.component.css'
})
export class DoctorsListAdminComponent implements OnInit {
  faEdit = faEdit
  faDelete = faDeleteLeft

  doctors: Doctor[] = []
  selectedDoctor!: Doctor

  userRole: string = 'unknown'

  isEditMode: boolean = false

  toggleEditMode (event?: Event): void {
    console.log('Edit mode toggled')
    if (event) {
      event.stopPropagation()
    }
    this.isEditMode = !this.isEditMode
    if (!this.isEditMode) {
      this.saveDoctorChanges()
    }
  }

  saveDoctorChanges (): void {
    const doctorData = {
      Fname: this.selectedDoctor.Fname ?? '',
      Lname: this.selectedDoctor.Lname ?? '',
      Email: this.selectedDoctor.Email ?? '',
      IdNumber: this.selectedDoctor.IdNumber ?? ''
    }

    if (this.selectedDoctor.Id) {
      this.doctorsService
        .editDoctor(this.selectedDoctor.Id, doctorData)
        .subscribe({
          next: response => {
            this.messageService.add({
              key: 'tc',
              severity: 'info',
              summary: 'Edited successfully'
            })
          },
          error: error => {
            console.error('Failed to update doctor', error)
          }
        })
    }
  }

  ngOnInit (): void {
    this.userRole = localStorage.getItem('userRole') || 'unknown'
    this.doctorsService.getDoctors().subscribe({
      next: (doctors: Doctor[]) => {
        this.doctors = doctors
      },
      error: error => {
        console.error('Error fetching doctors:', error)
      }
    })
  }

  constructor (
    public doctorsService: DoctorsService,
    private authService: AuthService,
    private messageService: MessageService,
    private appointmentsService: AppointmentsService
  ) {}

  isAdmin (): boolean {
    return this.userRole === 'admin'
  }

  getTotal (): number {
    return this.appointmentsService.getAppointmentsByDoctor.length
  }

  selectDoctor (doctorId: number) {
    this.doctorsService.getDoctor(doctorId).subscribe({
      next: doctor => {
        this.selectedDoctor = doctor
        console.log('Doctor selected:', doctor)
        console.log(this.selectedDoctor.ImageUrl)
      },
      error: error => {
        console.error('Error fetching doctor:', error)
      }
    })
  }

  getStars (score: number | undefined) {
    const validScore = score ?? 1
    return new Array(5).fill(false).map((_, index) => index < validScore)
  }

  deleteDoctor (doctor: Doctor): void {
    if (!this.authService.isAdmin()) {
      alert('Only admin can delete')
      return
    }
    this.doctorsService.deleteDoctor(doctor).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Info',
          detail: 'Successfully deleted',
          life: 4000
        })

        this.doctorsService.doctors = this.doctorsService.doctors.filter(
          doc => doc.id !== doctor.Id
        )
      },
      error: error => {
        console.error('Error deleting doctor:', error)
      }
    })
  }
}
