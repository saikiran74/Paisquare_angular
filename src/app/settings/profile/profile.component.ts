import { Component , ViewChild, ElementRef,OnInit } from '@angular/core';
import { Profile } from '../../paisa';
import { Router } from '@angular/router';
import { PaiService } from '../../paisa.service';
import { ActivatedRoute } from '@angular/router';
import { Comments,Follower,Visited,Like, Block, Report,Favourite,Rating } from '../../paisa';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent  implements OnInit{
  profile =new Profile()
  rating=new Rating()
  message=''
  userId=''
  username=''
  value:number=3;
  advertisements:any;
  profileImageUrl: string ="";
  advertiserId!:number;
  constructor(private _service: PaiService,private _router: Router,private _route: ActivatedRoute) {}
  ngOnInit(){
    
    this.username=this._service.userName
    this.userId=this._service.userId;
    this.getProfileImage()
    this._route.params.subscribe(params => {
      this.advertiserId = params['id']; 
      if (this.advertiserId) {
        console.log("advertiserId from profile",this.advertiserId)
        this.getProfile(this.advertiserId)
      }
    });
    this.getUserProfile(+this.userId)
    this._service.getUserAdvertisements(this.advertiserId).subscribe(
      data => {
        this.advertisements = data;
        console.log("advertisements",this.advertisements)
      },
        error=>{
          console.log("error occurred while retrieving the data for userId -")
    });
    console.log("getTotalLikes()",this.getTotalLikes())
    this.likes()
  }
  followerslist: any[] = [];
  userData: any[] = [];
  blockedlist: any[]=[];
  followersCount=0;
  followerobj= new Follower();
  follower(advertiserid: number){
    this.followerobj.following=true;
    this._service.FollowerFromRemote(this.followerobj,advertiserid,+this.userId).subscribe(
      data=>{
        console.log("follower updated");
        console.log("fetching user data");
        this.getUserProfile(+this.userId);
        this.getProfile(+advertiserid);
        console.log(" this.followersCount -", this.followersCount)
        //this._router.navigate(['homepage'])
      },
      error=>{
        console.log("error occured for following");
      }
    )
  }
  saveRating(advertiserId:any): any {
    console.log("this.profile.rating-->",this.profile.rating)
    //this.rating.advertiser=+advertiserId;
    //this.rating.user=+this.userId;
    this.rating.rating=this.profile.rating;
    console.log("this.rating-->",this.rating)
    this._service.saveRatingFromRemote(this.rating,advertiserId).subscribe(response => {
      
      console.log('Rating saved successfully:', response);
      this.profile.noOfRating=this.profile.noOfRating+1;
    }, error => {
      console.error('Error saving rating:', error);
    });
    
  }
  // loading profile data
  profileFound:boolean=false
  getProfile(advertiserId:Number){
    this._service.getProfileList(advertiserId).subscribe(
      data =>{
        this.profile=data;
        this.followersCount=this.getFollowersCount();
        console.log("this.followersCount",this.followersCount)
        console.log("searched profile details",this.profile);
        if (this.profile && Object.keys(this.profile).length > 0) {
          this.profileFound = true;
        }
        console.log("profile data is:",this.profile);
      },
      error=>{
        console.log("error occured in followerslist")
      }
    );
    console.log("this.profileFound ",this.profileFound)
  }
  getUserProfile(userId:Number){
    this._service.getProfileList(userId).subscribe(
      data =>{
        console.log("this is user profile",this.profile);
        this.followerslist=data.following;
        this.blockedlist=data.blockadvertiser;
        console.log("this.followerslist -> ",this.followerslist)
        console.log("this.blockedlist -> ",this.blockedlist)
      },
      error=>{
        console.log("error occured in followerslist")
      }
    );
    console.log("this.profileFound ",this.profileFound)
  }
  getProfileImage(): void {
    console.log("profileImageUrl")
    this._service.fetchAndProcessProfileImage(this.userId).subscribe(
      (url: string) => {
        this.profileImageUrl = url;
        console.log("Profile Image URL:", this.profileImageUrl);
      },
      (error) => {
        console.error("Error fetching profile image:", error);
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
  advertisementsAvailable:number=0;
  getTotalLikes(): number {
    // Guard clause: check if advertisements array is defined and non-empty
    if (!this.advertisements || this.advertisements.length === 0) {
      return 0;
    } else{
      this.advertisementsAvailable=this.advertisements.length;
    }
    
    return this.advertisements.reduce((total: number, ad: { id: number; name: string; likes: number[] }) => {
      return total + ad.likes.length;
    }, 0);
  }
  getTotalComments(): number {
    // Guard clause: check if advertisements array is defined and non-empty
    if (!this.advertisements || this.advertisements.length === 0) {
      return 0;
    }

    return this.advertisements.reduce((total: number, ad: { id: number; name: string; commenteduser: number[] }) => {
      return total + ad.commenteduser.length;
    }, 0);
  }
  getTotalvisiteduser(): number {
    if (!this.advertisements || this.advertisements.length === 0) {
      return 0;
    }
    return this.advertisements.reduce((total: number, ad: { id: number; name: string; visitscount: number }) => {
      return total + ad.visitscount;
    }, 0);
  }
    getFollowersCount(): number {
      return this.profile.followers?.length || 0;  // Safely access length
    }
  
    getFollowingCount(): number {
      return this.profile.following?.length || 0;  // Safely access length
    }

    likes(){
      this._service.getlikeFromRemote().subscribe(
        data=>{
          console.log("Likes recieved -->",data)
        },
        error=>{
          console.log("like error occured")
        }
      )
    }
    visited(){
      this._service.getVisitedFromRemote().subscribe(
        data=>{
          console.log("visited received",data)
        },
        error=>{
          console.log("visited error occured")
        }
      )
    }
    
}
