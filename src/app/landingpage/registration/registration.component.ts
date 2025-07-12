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
  locationDropdownList = [
    { name: 'India', value: 'India' }
  ];
  
  ngOnInit() {
    this.registrationForm = this.registrationFormGroup();
    this.registrationForm.valueChanges.subscribe(value => {
      this.otp=value.emailOTP;
    });
    /*this.registrationForm.statusChanges.subscribe(status => {
      console.log('Form status changes:', status);
    });*/
  }
  createaccoutButtonClicked:boolean=false
  isInvalid:boolean=false;
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
            this.createaccoutButtonClicked=false;
            this.isInvalid=true;
            this.showEmailOTPBox=false;
          } else if (response.code.includes("emailAddressNotFound")) {
            this.isInvalid=true;
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
            this.isInvalid=true;
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
          this.message = 'Registration failed. Please try again.';
        }
      );
    } else {
      this.message = 'Please fill out the form correctly.';
    }
  }
  registrationFormGroup(): FormGroup {
    return new FormGroup({
      username: new FormControl('', [Validators.required,Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required,Validators.email]),
      pincode: new FormControl('', Validators.required),
      accountType: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, this.passwordStrengthValidator()]),
      emailOTP: new FormControl(''),
      acceptTerms: new FormControl(false, Validators.requiredTrue),
      confirmPassword: new FormControl('', [Validators.required],)
    }, { validators: this.passwordMatchValidator });
  }
  passwordStrengthChecker:Boolean=false;
  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      const errors: ValidationErrors = {};
      const requirements: string[] = [];
  
      if (value.length < 8) {
        errors['tooShort'] = true;
        requirements.push('at least 8 characters');
      }
      if (!/[A-Z]/.test(value)) {
        errors['missingUpperCase'] = true;
        requirements.push('an uppercase letter');
      }
      if (!/[a-z]/.test(value)) {
        errors['missingLowerCase'] = true;
        requirements.push('a lowercase letter');
      }
      if (!/\d/.test(value)) {
        errors['missingNumber'] = true;
        requirements.push('a number');
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        errors['missingSpecialChar'] = true;
        requirements.push('a special character');
      }
  
      if (requirements.length > 0) {
        errors['passwordRequirementsMessage'] = `Create a password with ${requirements.join(', ')}.`;
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
}
