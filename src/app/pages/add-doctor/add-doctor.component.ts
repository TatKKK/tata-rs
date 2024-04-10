import { Component, OnDestroy } from '@angular/core';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, ValidationErrors, Validators, AbstractControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorsService } from '../../services/doctors.service';
import { AuthService } from '../../services/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrl: './add-doctor.component.css'
})
export class AddDoctorComponent {
  faEnvelope=faEnvelope;
  doctorForm: FormGroup;

  private destroy$ = new Subject<void>()
  userRole!:string;
  
  isUploading:boolean=false;

  constructor(
    private fb: FormBuilder,
    private authService:AuthService,
    private snackBar:MatSnackBar,
    private router: Router,
    private doctorsService: DoctorsService   ,
    private auth:AuthService
  ) {
    this.doctorForm = this.fb.group({
      Fname: ['', [Validators.required, this.validateName]],
      Lname: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      IdNumber: ['', [Validators.required, this.validateId]],
      Password: ['', [Validators.required, Validators.pattern(/.*@7.*/), this.validatePassword]],
      Image: null,
      Category: ['', Validators.required],
      Cv:null
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
  addDoctor(): void {
    console.log(this.doctorForm.controls)
    console.log(this.doctorForm.value);
console.log(this.doctorForm.errors);

    console.log("Form Validity:", this.doctorForm.valid);
    if (this.doctorForm.valid) {
      const formData = new FormData();
      formData.append('Fname', this.doctorForm.get('Fname')?.value ?? '');
      formData.append('Lname', this.doctorForm.get('Lname')?.value ?? '');
      formData.append('Category',this.doctorForm.get('Category')?.value ?? '')
      formData.append('Email', this.doctorForm.get('Email')?.value ?? '');
      formData.append('IdNumber', this.doctorForm.get('IdNumber')?.value ?? '');
      formData.append('Password', this.doctorForm.get('Password')?.value ?? '');
  
      // Set by default
      formData.append('Discriminator', 'doctor');
      console.log('apended'+formData);
  
      const imageControl = this.doctorForm.get('Image');
      if (imageControl?.value) {
        formData.append('Image', imageControl.value, imageControl.value.name);
      } else{console.log('jandaba');}

      const fileControl = this.doctorForm.get('Cv'); 
    if (fileControl?.value) {
      formData.append('Cv', fileControl.value, fileControl.value.name);
    }
  
      this.doctorsService.addDoctor(formData).subscribe({
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

  triggerFileInput(inputType: 'Image' | 'Cv'): void {
    document.getElementById(inputType)?.click();
    console.log(`${inputType} input clicked`);
  }

  
  onFileChange(event: Event, type: 'Image' | 'Cv'): void {
    this.isUploading = true;
    const element = event.currentTarget as HTMLInputElement;
    let files = element.files;
    if (files && files.length) {
        this.doctorForm.patchValue({
            [type]: files[0]
        });
        this.doctorForm.get(type)?.updateValueAndValidity();

        setTimeout(() => {
            this.isUploading = false; 
            console.log(type + ' Upload complete');
        }, 3000);
    }
}

}
