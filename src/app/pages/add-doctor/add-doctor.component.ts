import { Component } from '@angular/core';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, ValidationErrors, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorsService } from '../../services/doctors.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrl: './add-doctor.component.css'
})
export class AddDoctorComponent {
  faEnvelope=faEnvelope;
  doctorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
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
  isAdmin(): boolean {
    const userRole = this.auth.getUserRole();
    return userRole === 'admin';
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

  ngOnInit(): void {}
  
  addDoctor(): void {
    console.log(this.doctorForm.controls)
    console.log(this.doctorForm.value);
console.log(this.doctorForm.errors);
console.log(this.auth.getToken());
console.log(this.auth.getUserId());

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
          console.log("Registration successful.");
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
  
  
  onFileChange(event: Event, type: 'Image' | 'Cv'): void {
    const element = event.currentTarget as HTMLInputElement;
    console.log('changed');
    let files = element.files;
    if (files) {
      this.doctorForm.patchValue({ [type]: files[0] });
      this.doctorForm.get(type)?.updateValueAndValidity();
    }
  }
  

}
