import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import {NgForm} from '@angular/forms';
import { User } from '../../paisa';
import { PaiService } from '../../paisa.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth-service.service';
import { FormControl, FormGroup, Validators,ValidatorFn, AbstractControl,ValidationErrors  } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  message=''
  constructor(private _service: PaiService, private _router: Router, private authService: AuthService){};
  text=''
  loginForm!: FormGroup;
  successMessage:boolean=false;
  loginFormGroup(): FormGroup {
    return new FormGroup({
      email: new FormControl('', [Validators.required,Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }
  ngOnInit() {
    this.loginForm = this.loginFormGroup();
  }
  loginButtonDisable:boolean=false;
  userLogin(){
    this.successMessage=false;
    this.message="";
    this.loginButtonDisable=true;
    if(this.loginForm.valid){
      this._service.loginUserFromRemote(this.loginForm.value).subscribe(
        response=>{
          this.message= response.apiMessage.message;
          if(response.apiMessage.status=='success'){
            this.successMessage=true;
          }
          if(response.apiMessage.code.includes("validUser")){
            // Store the JWT token in AuthServsice
            this.authService.login(response.token);
            this._service.userId=response.user.id;
            this._service.userName=response.user.username;
            this._router.navigate(['advertiser'])
            //this._router.navigate(['home/profile/1'])
          } else if (response.apiMessage.code.includes("OTPNotVerified")) {
            console.log('OTPNotVerified', response.apiMessage);
          } else if (response.apiMessage.code.includes("emailIdNotFound")) {
            console.log('OTPNotVerified', response.apiMessage);
          } else{
            console.log('unknown error occured', response.apiMessage);
          } 
        //this._router.navigate(['advertiser'])
        //this._router.navigate(['home/profile/1'])
      },
        error=>{
        console.log("Error occured");
        this.message="Backend error! Please retry";
      });
    }
    this.loginButtonDisable=false;
  }
}
