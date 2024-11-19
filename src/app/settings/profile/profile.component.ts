import { Component , ViewChild, ElementRef,OnInit } from '@angular/core';
import { Profile } from '../../paisa';
import { Router } from '@angular/router';
import { PaiService } from '../../paisa.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent  implements OnInit{
  profile =new Profile()
  message=''
  userId=''
  username=''
  value:number=3;
  advertisements:any;
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
    this._service.getUserAdvertisements(+this.userId).subscribe(
      //todo not working check this.
      data => {
        this.userId=this._service.userId;
        this.advertisements = data;
        console.log("advertisements",this.advertisements)
      },
        error=>{
          console.log("error occurred while retrieving the data for userId -")
    });
    this._service.getFavouriteAdvertisements().subscribe(
      data => {
        this.advertisements = data;
        console.log("favourite list",data)
    },
      error=>{console.log("error occure while retrieving the data!")
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
  showLocationDialog:boolean=false;
  mapDialog(){
    this.showLocationDialog=true;
  }
  navigateToAdvertiserReports(){
    
    this._router.navigate(['advertiser/advertiserreport'])
  }


  openChat(Id: number, Name: string): void {
    console.log("number",Id,"advertiserName",Name)
    this._router.navigate(['/user/chat'], { 
      queryParams: { userId: Id, name: Name }
    });
  }
}
