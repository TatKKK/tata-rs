import { Component, Input } from '@angular/core'
import { DoctorsService } from '../../services/doctors.service'
import { ChangeDetectorRef } from '@angular/core'
import { Doctor } from '../../models/doctor.model'
import { AppointmentsService } from '../../services/appointments.service'

@Component({
  selector: 'app-doctor-general-card',
  templateUrl: './doctor-general-card.component.html',
  styleUrl: './doctor-general-card.component.css'
})
export class DoctorGeneralCardComponent {
  @Input() doctor!: Doctor
  @Input() doctorId!: number
  @Input() userId!: number

  constructor (
    public doctorsService: DoctorsService,
    public appointmentsService: AppointmentsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit (): void {
    if (
      this.doctor &&
      this.doctor.Id !== undefined &&
      this.doctor.Id !== null
    ) {
      this.appointmentsService.setCurrentDoctorId(this.doctor.Id)
    }
  }

  getStars (score: number | undefined) {
    const validScore = score ?? 1
    return new Array(5).fill(false).map((_, index) => index < validScore)
  }
}
