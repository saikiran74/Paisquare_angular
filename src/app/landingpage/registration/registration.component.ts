import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators,ValidatorFn, AbstractControl,ValidationErrors  } from '@angular/forms';
import { User } from '../../paisa';
import { PaiService } from '../../paisa.service';
import { Router } from '@angular/router';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  user= new User();
  message=''
  
  password:string = '';
  confirmPassword:string = '';
  email:string='';
  otp:string='';
  showEmailOTPBox:boolean=false;
  successMessage:boolean=false
  constructor(private _service: PaiService, private _router: Router) {
    
  }
  registrationForm!: FormGroup;
  registrationFormGroup(): FormGroup {
    return new FormGroup({
      username: new FormControl('', [Validators.required,Validators.maxLength(15)]),
      email: new FormControl('', [Validators.required,Validators.email]),
      pincode: new FormControl('', Validators.required),
      accountType: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, this.passwordStrengthValidator()]),
      emailOTP: new FormControl(''),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordMatchValidator });
  }
  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value = control.value || '';
      const errors: { [key: string]: boolean } = {};

      if (!/[A-Z]/.test(value)) {
        errors['missingUpperCase'] = true;
      }
      if (!/[a-z]/.test(value)) {
        errors['missingLowerCase'] = true;
      }
      if (!/\d/.test(value)) {
        errors['missingNumber'] = true;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        errors['missingSpecialChar'] = true;
      }
      if (value.length < 8) {
        errors['tooShort'] = true;
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }
  passwordMatchValidator(formGroup: AbstractControl): any {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');
    if (!passwordControl || !confirmPasswordControl) {
      return { mismatch: true }; 
    }
    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
  ngOnInit() {
    this.registrationForm = this.registrationFormGroup();
    this.registrationForm.valueChanges.subscribe(value => {
      this.otp=value.emailOTP;
    });
    this.registrationForm.statusChanges.subscribe(status => {
      console.log('Form status changes:', status);
    });
  }
  createaccoutButtonClicked:boolean=false
  registerUser() {
    this.message=''
    this.createaccoutButtonClicked=true;
    if (this.registrationForm.valid) {
      
      this.email = this.registrationForm.get('email')?.value;
      this._service.registerUserFromRemote(this.registrationForm.value).subscribe(
        response => {
          this.message= response.message;
          if(response.status=='success'){
            this.successMessage=true;
          }
          this.createaccoutButtonClicked=true;
          if(response.code.includes("emailExists")){
            this.registrationForm.enable();
            this.showEmailOTPBox=false;
          } else if (response.code.includes("emailAddressNotFound")) {
            this.showEmailOTPBox=false;
            this.registrationForm.enable();
          } else{
              this.registrationForm.disable();
              this.showEmailOTPBox=true;
              this.registrationForm.get('emailOTP')?.enable();
          }
        },
        error => {
          console.error('Registration failed', error);
          this.message = 'Registration failed. Please try again.';
        }
      );
    } else {
      this.message = 'Please fill out the form correctly.';
    }
  }
  

  disableverifyOTPButton:boolean=false;
  verifyOTP(){
    if (this.registrationForm.valid) {
      this.user.email=this.email;
      this.user.emailOTP=this.registrationForm.get('emailOTP')?.value
      
      this._service.verifyOTPCallFromRemote(this.user).subscribe(
        response => {
          this.message= response.message;
          if(response.status=='success'){
            this.successMessage=true;
          }
          if(response.code.includes("invalidOTP")){
            this.successMessage=false;
            this.registrationForm.get('emailOTP')?.enable();
          } else if (response.code.includes("OTPVerified")) {
            this._router.navigate(['/login']);
          } else{
              this.registrationForm.disable();
              this.showEmailOTPBox=true;
              this.registrationForm.get('emailOTP')?.enable();
          }
          
        },
        error => {
          console.error('Registration failed', error);
          this.message = 'Registration failed. Please try again.';
        }
      );
    } else {
      this.message = 'Please fill out the form correctly.';
    }
  }
}
