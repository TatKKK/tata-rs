import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';


@Component({
  selector: 'app-booking-dialog',
  templateUrl: './booking-dialog.component.html',
  styleUrl: './booking-dialog.component.css'
})
export class BookingDialogComponent {
  notes:string='';
  // display: boolean = true;
  
  constructor(public dialogRef: DynamicDialogRef){}
 
   onSubmit():void{
    this.dialogRef.close(this.notes);
  }
}

