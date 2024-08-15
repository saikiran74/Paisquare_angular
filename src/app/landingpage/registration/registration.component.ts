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
export class RegistrationComponent implements OnInit, OnChanges{
  user= new User();
  message=''
  
  constructor(private _service: PaiService, private _router: Router) {
    
  }
  registrationForm!: FormGroup;
  registrationFormGroup(): FormGroup {
    return new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required,Validators.email]),
      zipcode: new FormControl('', Validators.required),
      accountType: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordMatchValidator });
  }
  password:string = '';
  confirmPassword:string = '';
  passwordMatchValidator(formGroup: AbstractControl): any {
    console.log("passwordMatchValidator--->")
    console.log("formGroup",formGroup)
    console.log("formGroup.value",formGroup.value)
    console.log("formGroup.parent",formGroup.parent)
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');
    console.log("passwordControl",passwordControl)
    console.log("confirmPasswordControl",confirmPasswordControl)
    
    console.log("in passwordMatchValidator")
    if (!passwordControl || !confirmPasswordControl) {
      return { mismatch: true }; // If either control is missing, return null (no validation error)
    }
    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    console.log("password", password);
    console.log("confirmPassword", confirmPassword);

    // Return null if passwords match, otherwise return mismatch error
    return password === confirmPassword ? null : { mismatch: true };
  }
  ngOnInit() {
    this.registrationForm = this.registrationFormGroup();
    this.registrationForm.valueChanges.subscribe(value => {
      console.log('Form Value Changes:', value);
      this.password=value.password;
      this.confirmPassword=value.confirmPassword;
    });
    // Subscribe to status changes
    this.registrationForm.statusChanges.subscribe(status => {
      console.log('Form status changes:', status);
    });
  }
  showEmailOTPBox:boolean=false;

  ngOnChanges(registrationForm:any) {
    console.log('Component changes:', registrationForm);
    // Here you can react to input property changes if there were any
  }

  registerUser() {
    if (this.registrationForm.valid) {
      console.log('Form submitted', this.registrationForm.value);
      this._service.registerUserFromRemote(this.registrationForm.value).subscribe(
        response => {
          console.log('Registration successful', response);
          this._router.navigate(['/login']);
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
