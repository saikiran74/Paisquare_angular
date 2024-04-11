import { Component , ViewChild, ElementRef } from '@angular/core';
import { Profile } from '../../paisa';
import { Router } from '@angular/router';
import { PaiService } from '../../paisa.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profile =new Profile()
  message=''
  userId=''
  username=''
  constructor(private _service: PaiService,private _router: Router,private _route: ActivatedRoute) {}
  ngOnInit(){
    
    this.username=this._service.userName
    this._route.params.subscribe(params => {
      const advertiserId = params['id']; 
      if (advertiserId) {
        console.log("advertiserId from profile",advertiserId)
        this.getProfile(advertiserId)
      }
    });
  }
  // loading profile data
  getProfile(advertiserId:Number){
    this._service.getProfileList(advertiserId).subscribe(
      data =>{
        this.profile=data;
        console.log("profile data is:",this.profile);
      },
      error=>{
        console.log("error occured in followerslist")
      }
    );
  }
}
