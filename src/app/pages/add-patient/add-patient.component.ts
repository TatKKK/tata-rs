import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AbstractControl } from '@angular/forms'
import { ValidationErrors } from '@angular/forms'
import { Router } from '@angular/router'
import { PatientsService } from '../../services/patients.service'
import { tap } from 'rxjs'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { MessageService } from 'primeng/api'
import { AuthService } from '../../services/auth/auth.service'
import { Login } from '../../models/user.model'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.css'
})
export class AddPatientComponent implements OnInit {
  faSpin = faSpinner
  patientForm: FormGroup
  userEnteredCode: string = ''
  isActivationCodeVerified: boolean = false
  activationCodeInvalid: boolean = true

  isUploading: boolean = false

  constructor (
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private patientsService: PatientsService
  ) {
    this.patientForm = this.fb.group({
      Fname: ['', [Validators.required, this.validateName]],
      Lname: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      IdNumber: [
        '',
        [Validators.required, this.validateId, Validators.pattern(/^\d{11}$/)]
      ],
      Password: [
        '',
        [
          Validators.required,
          this.validatePassword,
          Validators.pattern(/.*@7.*/)
        ]
      ],
      // activationCode: ['', Validators.required] ,//am modelshi araa..
      Image: null
    })
  }

  validateName (control: AbstractControl): ValidationErrors | null {
    return control.value.length < 3
      ? { wrongName: { value: control.value } }
      : null
  }
  validateId (control: AbstractControl): ValidationErrors | null {
    return control.value.length !== 11
      ? { wrongId: { value: control.value } }
      : null
  }
  validatePassword (control: AbstractControl): ValidationErrors | null {
    return control.value.length < 8
      ? { invalidPassword: { value: control.value } }
      : null
  }

  ngOnInit (): void {}

  addPatient (): void {
    if (this.patientForm.valid) {
      const formData = new FormData()
      formData.append('Fname', this.patientForm.get('Fname')?.value ?? '')
      formData.append('Lname', this.patientForm.get('Lname')?.value ?? '')
      const email = this.patientForm.get('Email')?.value ?? ''
      const password = this.patientForm.get('Password')?.value ?? ''
      formData.append('Email', email)
      formData.append('IdNumber', this.patientForm.get('IdNumber')?.value ?? '')
      // formData.append('Code', this.patientForm.get('Code')?.value ?? '');
      formData.append('Password', this.patientForm.get('Password')?.value ?? '')

     
      formData.append('Discriminator', 'patient')

      const imageControl = this.patientForm.get('Image')
      if (imageControl?.value) {
        formData.append('Image', imageControl.value, imageControl.value.name)
      }

      this.patientsService.addPatient(formData).subscribe({
        next: res => {
          this.snackBar.open('Successfully registered', 'Close', {
            duration: 5000
          })
          const loginInfo: Login = { email: email, password: password }
          this.authService.authenticate(loginInfo).subscribe({
            next: authRes => {
              this.router.navigate(['/userPage', email])
            },
            error: authErr => {
              console.error('Authentication error:', authErr)
            }
          })
        },
        error: err => {
          console.error('Error response', err.error)
        }
      })
    } else {
      console.error('Form is not valid')
    }
  }

  triggerFileInput (): void {
    document.getElementById('Image')?.click()
    console.log('clicked')
  }

  onFileChange (event: Event): void {
    this.isUploading = true
    const element = event.target as HTMLInputElement
    let files = element.files
    if (files && files.length) {
      this.patientForm.patchValue({
        Image: files[0]
      })

      this.patientForm.get('Image')?.updateValueAndValidity()
      setTimeout(() => {
        this.isUploading = false
        console.log('Upload complete')
      }, 3000)
    }
  }

  createActivationCode (): void {
    const email = this.patientForm.get('Email')?.value
    if (email) {
      this.patientsService.createActivationCode(email).subscribe({
        next: response => {
          console.log('Activation code created:', response)
          this.userEnteredCode = response.activationCode
          this.patientForm.patchValue({ activationCode: this.userEnteredCode })
          this.messageService.add({
            key: 'tc',
            severity: 'info',
            summary: 'Check activation code in console',
            life: 2000
          })
        },
        error: error => {
          console.error('Error creating activation code:', error)
        }
      })
    } else {
      console.error('Email is invalid or not provided')
    }
  }

  verifyActivationCode (): void {
    const email = this.patientForm.get('Email')?.value
    const activationCode = this.userEnteredCode

    if (!email || !activationCode) {
      console.error('Email and activation code are required.')
      this.activationCodeInvalid = true
      return
    }

    this.patientsService
      .verifyActivationCode(email, activationCode)
      .pipe(
        tap(isValid => {
          console.log(`Verification attempt for ${email}`)
        })
      )
      .subscribe({
        next: isValid => {
          if (isValid) {
            console.log('kodi sworia')
            this.isActivationCodeVerified = true
            this.addPatient()
            this.messageService.add({
              key: 'tc',
              severity: 'success',
              summary: 'Successfully registered',
              life: 7000
            })
          } else {
            console.error('Invalid or expired activation code.')
            this.activationCodeInvalid = true
          }
        },
        error: error => {
          console.error(
            'An error occurred while verifying the activation code',
            error
          )
          this.activationCodeInvalid = true
        }
      })
  }
}
