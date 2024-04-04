import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-login-prompt',
  templateUrl: './login-prompt.component.html',
  styleUrl: './login-prompt.component.css'
})
export class LoginPromptComponent {
  display: boolean = true;

  @Output() closeEvent = new EventEmitter<void>();

  constructor(private router:Router,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig
   ){

  }

  onOkClick(): void {
    this.display = false;
    this.closeEvent.emit();
  }

  navigateAndClose(url: string): void {
    this.router.navigateByUrl(url).then(() => {
        this.closeDialog();
    });
}

private closeDialog(): void {
  if (this.dialogRef) {
    this.dialogRef.close();
  }
}

}
