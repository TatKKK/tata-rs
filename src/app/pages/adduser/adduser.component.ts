import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientsService } from '../../services/patients.service';
import { DoctorsService } from '../../services/doctors.service';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private patientsService: PatientsService,
    private doctorsService: DoctorsService
  ) {
    this.userForm = this.fb.group({
      Discriminator: ['patient', Validators.required],
      Fname: [''],
      Lname: [''],
      Email: [''],
      IdNumber: [''],
      Password: [''],
      Category: [''],
      Image:null
    });
  }

  ngOnInit(): void {}

  addUser(): void {
    if (this.userForm.valid) {
      const formData = new FormData();
      formData.append('Fname', this.userForm.get('Fname')?.value ?? '');
      console.log(this.userForm.get('Fname'));
      formData.append('Lname', this.userForm.get('Lname')?.value ?? '');
      console.log(this.userForm.get('Lname'));
      formData.append('Email', this.userForm.get('Email')?.value ?? '');
      console.log(this.userForm.get('Email'));
      formData.append('IdNumber', this.userForm.get('IdNumber')?.value ?? '');
      console.log(this.userForm.get('IdNumber'));
      formData.append('Password', this.userForm.get('Password')?.value ?? '');
      console.log(this.userForm.get('Password'));
      formData.append('Discriminator', this.userForm.get('Discriminator')?.value ?? '');
      console.log(this.userForm.get('Discriminator'));
  
      const discriminator = this.userForm.get('Discriminator')?.value;
      const categoryValue = discriminator === 'doctor' ? this.userForm.get('Category')?.value : '';
      formData.append('Category', categoryValue);
      console.log(this.userForm.get('Category'));
  
      const imageControl = this.userForm.get('Image');
      if (imageControl?.value) {
        formData.append('Image', imageControl.value, imageControl.value.name);
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
  
  
  
  onFileChange(event: Event): void {
    const element = event.target as HTMLInputElement;
    let files = element.files;
    if (files && files.length) {
     
      this.userForm.patchValue({
        Image: files[0]
      });
    
      this.userForm.get('Image')?.updateValueAndValidity();
    }
  }
  
  }

