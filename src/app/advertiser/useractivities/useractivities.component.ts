import { Component, OnInit,Input } from '@angular/core';
import { PaiService } from '../../paisa.service';
import {HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Comments,Follower,Visited,Like, Block, Report,Favourite } from '../../paisa';
@Component({
  selector: 'app-useractivities',
  templateUrl: './useractivities.component.html',
  styleUrls: ['./useractivities.component.css']
})
export class UseractivitiesComponent implements OnInit{
  constructor(private _service: PaiService,private http: HttpClient,private _router: Router,private _route: ActivatedRoute) {
       
  }
  followingAdvertisementsList: any[]=[];
  favouriteAdvetisementsList: any[]=[];
  likedAdvetisementsList: any[]=[];
  visitedAdvertisementsList:any[]=[];
  blockedAdvertisementsList: any[]=[];
  reportedAdvetisementsList: any[]=[];
  userId='';

  ngOnInit(){
    this.visitedAdvertisements()
    this.favouriteAdvertisements()
    this.likedAdvertisements()
    this.followingAdvertisements()
    this.userId=this._service.userId;
  }
  favouriteAdvertisements(){
    this._service.getFavouriteAdvertisements().subscribe(
      data => {
        this.favouriteAdvetisementsList = data;
        console.log("favourite list",data)
    },
      error=>{console.log("error occure while retrieving the data!")
    });
  }
  likedAdvertisements(){
    this._service.getLikedAdvertisements().subscribe(
      data => {
        this.likedAdvetisementsList = data;
        console.log("liked list",data)
    },
      error=>{console.log("error occure while retrieving the data!")
    });
  }
  followingAdvertisements(){
    this._service.getFollowingAdvertisements().subscribe(
      data => {
        this.followingAdvertisementsList = data;
    },
      error=>{console.log("error occure while retrieving the data!")
    });
  }
  visitedAdvertisements(){
    this._service.getVisitedAdvertisements().subscribe(
      data => {
        this.visitedAdvertisementsList = data;
        console.log("visited list",data)
    },
      error=>{console.log("error occure while retrieving the data!")
    });
  }
}
