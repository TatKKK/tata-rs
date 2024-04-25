import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrl: './appointment-details.component.css'
})
export class AppointmentDetailsComponent implements OnInit {
  appointment!:Appointment;

  constructor(public config: DynamicDialogConfig) {}

  ngOnInit(): void {
    if (this.config.data) {
      this.appointment = this.config.data.appointment; 
    }
  }

}
