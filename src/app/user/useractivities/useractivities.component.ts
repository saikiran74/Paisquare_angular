import { Component, OnInit,Input } from '@angular/core';
import { PaiService } from '../../paisa.service';
import {HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { startingLetterPipe } from 'src/app/static/startingLetterPipe.pipe';
import { Comments,Follower,Visited,Like, Block, Report,Favourite, Profile } from '../../paisa';
import { ExponentialStrengthPipe } from 'src/app/static/exponential-strength.pipe';
@Component({
  selector: 'app-useractivities',
  templateUrl: './useractivities.component.html',
  styleUrls: ['./useractivities.component.css'],
})
export class UseractivitiesComponent implements OnInit{
  constructor(private _service: PaiService,private http: HttpClient,private _router: Router,private _route: ActivatedRoute) {
       
  }
  
  userId='';
  advertisement:boolean=false;
  profile:boolean=false;
  ngOnInit(){
    this.userId=this._service.userId;
    this.likedAdvertisements()
    this._service.getUserFollowingProfiles(+this.userId).subscribe(
      data => {
      },
      error=>{console.log("error occure while retrieving the data!")
    });
    
  }
  advertisementsOnClick:any;
  activeButton:String='Liked';
  followingactiveButton:String='FollowingAdvertisement';
  blockedactiveButton:string='BlockedAdvertisements';
  fetchAdvertisementsOnClick(value:string){
    this.advertisement=true;
    this.profile=false;
    this.followingactiveButton='FollowingAdvertisement';
    this.blockedactiveButton='BlockedAdvertisements';
    if(value=='Liked'){
      this.activeButton='Liked'
      this.likedAdvertisements()
      
    } else if (value=='Favourites') {
      this.activeButton='Favourites'
      this.favouriteAdvertisements()
      
    } else if (value=='Following') {
      this.activeButton='Following'
      this.followingAdvertisements()
      
    } else if (value=='Visited'){
      this.activeButton='Visited'
      this.visitedAdvertisements()
      
    } else if (value=='Blocked'){
      this.activeButton='Blocked'
      this.blockedAdvertisements()
      
    } else{
      this.advertisementsOnClick = [];
    }
  }
  favouriteAdvertisements(){
    this._service.getFavouriteAdvertisements().subscribe(
      data => {
        this.advertisementsOnClick = data;
    },
      error=>{console.log("error occure while retrieving the data!")
    });
  }
  likedAdvertisements(){
    this._service.getLikedAdvertisements().subscribe(
      data => {
        this.advertisementsOnClick = data;
    },
      error=>{console.log("error occure while retrieving the data!")
    });
  }
  followingAdvertisements(){
    this._service.getFollowingAdvertisements().subscribe(
      data => {
        this.advertisementsOnClick = data;
    },
      error=>{console.log("error occure while retrieving the data!")
    });
  }
  visitedAdvertisements(){
    this._service.getVisitedAdvertisements().subscribe(
      data => {
        this.advertisementsOnClick = data;
    },
      error=>{console.log("error occure while retrieving the data!")
    });
  }
  blockedAdvertisements(){
    this._service.getBlockedAdvertisements().subscribe(
      data => {
        this.advertisementsOnClick = data;
        console.log("this.advertisementsOnClick-",this.advertisementsOnClick)
    },
      error=>{console.log("error occure while retrieving the data!")
    });
  }
  profileList:any;
  followingProfileView:boolean=false;
  fetchProfileOnClick(value:string){
    this.advertisement=false;
    this.profile=true;
    this.followingactiveButton='FollowingProfiles';
    this.blockedactiveButton='BlockedProfiles';
    if(value=='Blocked'){
      this.activeButton='Blocked'
      this.followingProfileView=false;
      this.Blockedprofile()
      
    } else if (value=='Following') {
      this.activeButton='Following'
      this.followingProfileView=true;
      this.followingprofile()
      
    }
  }
  Blockedprofile(){
    this._service.getUserBlockedProfiles(+this.userId).subscribe(
      data => {
        this.profileList = data;
    },
      error=>{console.log("error occure while retrieving the data!")
    });
  }
  followingprofile(){
    this._service.getUserFollowingProfiles(+this.userId).subscribe(
      data => {
        this.profileList = data;
        console.log(this.profileList)
    },
      error=>{console.log("error occure while retrieving the data!")
    });
  }
  
  followerobj= new Follower();
  blockobj=new Block();
  block(advertiserid: number){
    this.blockobj.userid=this._service.userId;
    this.blockobj.advertiserid=advertiserid;
    this.blockobj.blocked=true;
    this._service.postBlockAdvertiser(this.blockobj,this._service.userId,advertiserid).subscribe(
      data=>{
        this.Blockedprofile()
      },
      error=>{
        console.log("error occured while blocking advertiser")
      }
    )
  }
  follower(advertiserid: number){
    this.followerobj.following=true;
    this._service.FollowerFromRemote(this.followerobj,advertiserid,+this.userId).subscribe(
      data=>{
        this.followingprofile()
      },
      error=>{
        console.log("error occured for following");
      }
    )
  }
  visitProfile(id:number){
    this._router.navigate(['general/profile', id]);
  }
}
