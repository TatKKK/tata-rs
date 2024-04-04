import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorsService } from '../../doctors.service';
import { Doctor } from '../../models/doctor.model';
import { ChangeDetectorRef } from '@angular/core';
import { AppointmentsService } from '../../appointments.service';


@Component({
  selector: 'app-doctor-info-card',
  templateUrl: './doctor-info-card.component.html',
  styleUrl: './doctor-info-card.component.css'
})
export class DoctorInfoCardComponent implements OnInit {
  @Input() doctor!: Doctor;

  constructor(
    private route: ActivatedRoute,
    private doctorsService: DoctorsService,
    public appointmentsService: AppointmentsService,
    private changeDetectorRef: ChangeDetectorRef,
    
  ){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.doctorsService.getDoctor(id).subscribe({
          next: (doctor) => {
            this.doctor = doctor;
            this.changeDetectorRef.detectChanges(); 
            console.log(doctor);
            if (doctor && doctor.Id !== undefined && doctor.Id !== null) {
              this.appointmentsService.setCurrentDoctorId(doctor.Id);
            }
          },
          error: (err) => console.error('Failed to fetch doctor', err),
          complete: () => console.log('Fetch doctor call completed')
        });
      }
    });
  }

  getStars(score: number | undefined) {
    const validScore = score ?? 1;
    return new Array(5).fill(false).map((_, index) => index < validScore);
  }
  getTotal():number{
    return this.appointmentsService.getAppointmentsByDoctor.length;
  }
}