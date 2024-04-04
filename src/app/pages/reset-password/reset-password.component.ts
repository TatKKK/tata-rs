import { Component } from '@angular/core';
import { PatientsService } from '../../services/patients.service';
import { Observable,map, catchError, of, tap } from 'rxjs';
import { pipe } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {


  Email: string = '';
  Password:string='';
  userEnteredCode: string = ''; 
  newPassword!: string;
  confirmNewPassword!: string;
  isActivationCodeVerified: boolean = false;
  activationCodeInvalid: boolean = false;
  showVerifyField:boolean=false;
  showEmailInputField:boolean=true;
  showNotification: boolean = false;
  showVerificationFields: boolean = false;

  constructor(private http: HttpClient, 
    private patientsService: PatientsService,
    private userService:UserService,
    private messageService: MessageService,
    private router:Router) {}

  createActivationCode(): void {
    if (this.Email) {
      this.patientsService.createActivationCode(this.Email).subscribe({
        next: (response) => {
          console.log('Activation code created:', response); 
          this.showEmailInputField=false;
          this.userEnteredCode = response.activationCode;
          this.showVerifyField = true;

   this.messageService.add({ key: 'tl', severity:'info', summary: 'Activation Code', detail: 'Activation code is sent to your email. Check console'});
        },
        error: (error) => {
          console.error('Error creating activation code:', error);
        }
      });
    } else {
      console.error('Email is invalid or not provided');
    }
  }
  verifyActivationCode(): void {
    const email = this.Email; 
    const activationCode= this.userEnteredCode; 
    
    if (!email || !activationCode) {
      console.error('Email and activation code are required.');
      this.activationCodeInvalid = true; 
      return;
    }
    
    this.patientsService.verifyActivationCode(email, activationCode).pipe(
      tap(isValid => {
        console.log(`Verification attempt for ${email}`);
      })
    ).subscribe({
      next: isValid => {
        if (isValid) {
          console.log(`Activation code verified for ${email}. Proceeding with registration.`);
          this.isActivationCodeVerified = true; 
          this.showVerifyField=false;
          
        } else {
          console.error('Invalid or expired activation code.');
          this.activationCodeInvalid = true; 
        }
      },
      error: error => {
        console.error('An error occurred while verifying the activation code', error);
        this.activationCodeInvalid = true; 
      }
    });
  }
   
  updatePassword(){
    this.userService.updatePassword(this.Email, this.Password).subscribe({
      next: (response) => {
        this.messageService.add({ key: 'tl', severity:'info', summary: 'Password update', detail: 'Password is successfully updated'});
        this.isActivationCodeVerified=false;
        this.router.navigate(['/']);        
      },
      error: (error) => {
        console.error('There was an error updating the password', error);
      },
      complete: () => {
        console.log('Completed');
      }

    })
  }
}
