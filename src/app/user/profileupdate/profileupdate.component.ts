import { Component } from '@angular/core';
import { Profile } from '../../paisa';
import { Router } from '@angular/router';
import { PaiService } from '../../paisa.service';

@Component({
  selector: 'app-profileupdate',
  templateUrl: './profileupdate.component.html',
  styleUrls: ['./profileupdate.component.css']
})
export class ProfileupdateComponent {
  profile =new Profile()
  message=''
  userId=''
  constructor(private _service: PaiService,private _router: Router) {}
  
  ngOnInit(){
    // loading profile data
    this._service.getProfileList(this._service.userId).subscribe(
      data =>{
        this.profile=data;
        console.log("profile data is:",this.profile);
      },
      error=>{
        console.log("error occured in followerslist")
      }
    );
  }
  profileupdateForm(){
    this._service.ProfileUpdateFromRemote(this.profile,this._service.userId).subscribe(
      data=>{
        console.log("Response received");
        this.message="Profile updated/saved";
        this._router.navigate(['profile',this._service.userId])
    },
      error=>{
        console.log("profile not saved");
      this.message="Invalid details";
    }
    )
  }
}
