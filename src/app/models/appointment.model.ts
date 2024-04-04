export class Appointment {
  Id?: number;
  DoctorId?: number|null;
  PatientId?: number|null;
  StartTime?: Date;
  EndTime?: Date;
  Notes?: string;
  IsBooked?: boolean;

  constructor(startTime: Date, doctorId?: number | null, patientId?: number | null) {
    this.StartTime = startTime;
    // this.EndTime = new Date(startTime.getTime() + 60 * 60 * 1000);
    this.DoctorId = doctorId ?? null;
    this.PatientId = patientId ?? null;
  }
  
  
}


export interface Day {
  date: Date;
  isWeekend:boolean;
  isDayOff:boolean;
  appointments:Appointment[];
  
}