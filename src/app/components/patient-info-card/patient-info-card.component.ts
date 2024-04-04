import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientsService } from '../../patients.service';
import { Patient } from '../../models/patient.model';
import { User } from '../../models/user.model';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentsService } from '../../appointments.service';

import { AuthService } from '../../auth.service';



@Component({
  selector: 'app-patient-info-card',
  templateUrl: './patient-info-card.component.html',
  styleUrl: './patient-info-card.component.css'
})
export class PatientInfoCardComponent implements OnInit { 
  @Input() userId: number | null = null;
  
  patient: User = new User(null);
  // patient!:Patient;

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    public patients:PatientsService,
    public appointments:AppointmentsService,
    private changeDetectorRef:ChangeDetectorRef,
    private auth:AuthService
  ){}

  ngOnInit(): void {    
    if((!this.auth.authenticate) || this.auth.getUserRole() !== 'patient') {
      alert('Not Authorized');
      this.router.navigate(['/login']); 
      return;
    }

    this.route.params.subscribe(params=>{
      const id=+params['id'];
      if(id){
        this.patients.getPatient(id).subscribe({
          next:(patient)=>{
            this.patient=patient;
            this.changeDetectorRef.detectChanges(); 
            console.log(patient.Id);
            if (patient && patient.Id !== undefined && patient.Id !== null) {
              this.appointments.setCurrentPatientId(patient.Id);
            }
          },
          error:(err)=>{
            console.error('failed to fetch patient',err);
          },
          complete:()=>{
            console.log("Fetch patient call completed");
          }
        });
      }
      else{
        console.log("no id");
      }
    });    
  }
  
getToTal():number{
  return this.appointments.getAppointmentsByPatient.length;
}

}


