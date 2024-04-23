import { Component } from '@angular/core';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, ValidationErrors, Validators, AbstractControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.css'
})
export class AddAdminComponent {
  faEnvelope=faEnvelope;
  adminForm: FormGroup;

  private destroy$ = new Subject<void>()
  userRole!:string;
  
  isUploading:boolean=false;

  constructor(
    private fb: FormBuilder,
    private authService:AuthService,
    private snackBar:MatSnackBar,
    private router: Router,
    private userService:UserService,
    private auth:AuthService
  ) {
    this.adminForm = this.fb.group({
      Fname: ['', [Validators.required, this.validateName]],
      Lname: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      IdNumber: ['', [Validators.required, this.validateId]],
      Password: ['', [Validators.required, Validators.pattern(/.*@7.*/), this.validatePassword]],
      Image: null,
    });   
  }
  
  validateName(control:AbstractControl):ValidationErrors | null {
    return control.value.length <3?{wrongName:{value:control.value}}:null;
  }
  validateId(control:AbstractControl):ValidationErrors | null {
    return control.value.length !==11?{wrongId:{value:control.value}}:null;
  }
  validatePassword(control:AbstractControl):ValidationErrors | null {
    return (control.value.length<3)?{wrongPassword:{value:control.value}}:null;
  }

  ngOnInit(): void {      
    this.authService.getUserRole().pipe(takeUntil(this.destroy$)).subscribe(role => {
      this.userRole = role;
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  addUser(): void {
    console.log(this.adminForm.controls)
    console.log(this.adminForm.value);
console.log(this.adminForm.errors);

    console.log("Form Validity:", this.adminForm.valid);
    if (this.adminForm.valid) {
      const formData = new FormData();
      formData.append('Fname', this.adminForm.get('Fname')?.value ?? '');
      formData.append('Lname', this.adminForm.get('Lname')?.value ?? '');
      formData.append('Email', this.adminForm.get('Email')?.value ?? '');
      formData.append('IdNumber', this.adminForm.get('IdNumber')?.value ?? '');
      formData.append('Password', this.adminForm.get('Password')?.value ?? '');
  
      // Set by default
      formData.append('Discriminator', 'admin');
      console.log('apended'+formData);
  
      const imageControl = this.adminForm.get('Image');
      if (imageControl?.value) {
        formData.append('Image', imageControl.value, imageControl.value.name);
      } else{console.log('jandaba');}

      
  
      this.userService.addUser(formData).subscribe({
        next: (res) => {
          this.snackBar.open('Successfully registered', 'Close', { duration: 5000 });
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error("Error response", err.error);
        }
      });
    } else {
      console.error("Form is not valid");
    }
  }

  triggerFileInput(inputType: 'Image'): void {
    document.getElementById(inputType)?.click();
    console.log(`${inputType} input clicked`);
  }
  
  onFileChange(event: Event, type: 'Image'): void {
    this.isUploading = true;
    const element = event.currentTarget as HTMLInputElement;
    let files = element.files;
    if (files && files.length) {
        this.adminForm.patchValue({
            [type]: files[0]
        });
        this.adminForm.get(type)?.updateValueAndValidity();

        setTimeout(() => {
            this.isUploading = false; 
            console.log(type + ' Upload complete');
        }, 3000);
    }
}

}


