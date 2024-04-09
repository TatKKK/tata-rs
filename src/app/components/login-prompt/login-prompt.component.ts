import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogComponent } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-login-prompt',
  templateUrl: './login-prompt.component.html',
  styleUrl: './login-prompt.component.css'
})
export class LoginPromptComponent {
  display: boolean = true;
visible:boolean=false;


  constructor(private router:Router,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogComp:DynamicDialogComponent
   ){

  }

  

  navigateAndClose(url: string): void {
    this.router.navigateByUrl(url).then(() => {
        this.dialogRef.close();
    });
}

closeMainDialog(): void {
  if (this.dialogRef) {
      this.dialogRef.close();
  }
}

private closeDialog(): void {
  if (this.dialogRef) {
    this.dialogRef.close();
  }
}
closeOnOuterClick(): void {
  console.log('clicked');
  this.closeDialog();
}
}
