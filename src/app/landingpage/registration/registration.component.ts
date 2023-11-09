import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';
import { User } from '../../paisa';
import { PaiService } from '../../paisa.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  user= new User();
  message=''
  
  constructor(private _service: PaiService, private _router: Router){};

  registerUser(){
    console.log("in registration")
    if(this.user.firstname==null){
      this.message="first name required";
    }
    else if(this.user.lastname==null){
      this.message="last name required";
    }
    else if(this.user.email==null){
        this.message="email required";
    }
    else if(this.user.password==null){
      this.message="password required";
    }
    else{
      this._service.registerUserFromRemote(this.user).subscribe(
        data=>{console.log("Response received");
        this._router.navigate(['login'])
      },
        error=>{console.log("Error occured");
        this.message="Invalid details";
      }
        
      )
    }
  }
}
