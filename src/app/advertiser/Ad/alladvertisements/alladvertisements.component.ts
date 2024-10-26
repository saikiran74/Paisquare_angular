import { Component, OnInit,Input } from '@angular/core';
import { PaiService } from '../../../paisa.service';
import {HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../service/auth-service.service';
import { Comments,Follower,Visited,Like, Block, Report,Favourite } from '../../../paisa';
interface City {
  name: string,
  value: string
}
@Component({
  selector: 'app-alladvertisements',
  templateUrl: './alladvertisements.component.html',
  styleUrls: ['./alladvertisements.component.css']
})
/* todo write code for filtering ad by country*/

export class AlladvertisementsComponent implements OnInit {
constructor(private _service: PaiService,private http: HttpClient,private _router: Router,
  private _route: ActivatedRoute,private authService: AuthService) {
       
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

cities!: City[];
selectedCities!: City[];
ngOnInit(){
  this.cities = [
    {name: 'New York', value: 'NY'},
    {name: 'Rome', value: 'RM'},
    {name: 'London', value: 'LDN'},
    {name: 'Istanbul', value: 'IST'},
    {name: 'Paris', value: 'PRS'}

];

  const token = this.authService.getToken();
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
