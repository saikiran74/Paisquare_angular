import { Component, OnInit,Input } from '@angular/core';
import { PaiService } from '../../../paisa.service';
import {HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Comments,Follower,Visited,Like, Block, Report,Favourite } from '../../../paisa';

@Component({
  selector: 'app-alladvertisements',
  templateUrl: './alladvertisements.component.html',
  styleUrls: ['./alladvertisements.component.css']
})
export class AlladvertisementsComponent implements OnInit {
constructor(private _service: PaiService,private http: HttpClient,private _router: Router,private _route: ActivatedRoute) {
       
}
advertisements:any[]=[];
userAdvertisementslist: any[]=[];
blockedAdvertisementslist: any[]=[];
followingAdvertisementslist: any[]=[];
followerslist: any[] = [];
userData: any[] = [];
blockedlist: any[]=[];
favouriteslist: any[]=[];
userId='';
ngOnInit(){
  this._route.params.subscribe(params => {
    const adId = params['id']; // Access ad ID from URL if provided
    const userId = params['userId']; // Access user ID from URL if provided

    if (adId) {
      // Fetch and display specific ad by ID
      this._service.getIDAdvertisements(adId).subscribe(
        data => {
          this.userId=this._service.userId;
          this.advertisements = data;
          console.log("advertisment list for id: ",adId,this.advertisements)
        },
          error=>{console.log("error occured while retrieving the data for ID -",adId)
      });
    } else if (userId) {
      // Fetch and display ads by user
      this._service.getUserAdvertisements(userId).subscribe(
        data => {
          this.userId=this._service.userId;
          this.advertisements = data;
          console.log("advertisment list for userId: ",adId,this.advertisements)
        },
          error=>{console.log("error occurred while retrieving the data for userId -",userId)
      });
    } else {
      this.fetchadvertisement()
    }
  });
  this.userId=this._service.userId;
}
fetchadvertisement(){
  this._service.getAllAdvertisements().subscribe(
    data => {
    this.userId=this._service.userId;
    this.advertisements = data;
  },
    error=>{console.log("error occur while retrieving the data!")
  });
}
}
