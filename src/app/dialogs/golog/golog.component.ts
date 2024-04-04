import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogEventsService } from '../../services/dialog-events.service';


@Component({
  selector: 'app-golog',
  templateUrl: './golog.component.html',
  styleUrl: './golog.component.css'
})
export class GologComponent {
  constructor(
    public dialogRef: MatDialogRef<GologComponent>,
    private router: Router,
    private dialogEventsService: DialogEventsService
  ) {}
  navigateAndClose(url: string): void {
    this.router.navigateByUrl(url).then(() => {
        this.dialogRef.close(); 
        this.dialogEventsService.requestCloseDialogs();
    });
}

}


