import { Appointment } from "./appointment.model";

export interface CalendarDay {
    date: Date;
    isWorkingDay: boolean;    
    isInCurrentMonth: boolean;
    // events: CalendarEvent[];
    // color: string;
    // isFree:boolean;
    hasDayoff:boolean;
    hours:HourInfo[]
  }

  interface HourInfo {
    hour: number;
    isBooked: boolean;
  }
  export interface CalendarHour {
    hour: number;
    isBooked: boolean;
    appointmentDetails?: Appointment; 
  }
  export interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
    color:string
  }
  