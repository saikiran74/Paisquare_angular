import { Component, OnInit,Input,HostListener } from '@angular/core';
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
adId='';
cities!: City[];
selectedCities!: City[];
chips: { label: string }[] = [];
activeChipIndex = 0;


ngOnInit(){
  this.checkViewport();
  this.fetchDistinctHashtags();
  this.cities = [
    {name: 'New York', value: 'NY'},
    {name: 'Rome', value: 'RM'},
    {name: 'London', value: 'LDN'},
    {name: 'Istanbul', value: 'IST'},
    {name: 'Paris', value: 'PRS'}
      
    ];
  this.advertisements=[];
  this.fetchDistinctHashtags();
  const token = this.authService.getToken();
  /*const navigation = this._router.getCurrentNavigation();
  console.log('Navigation object:', navigation); // Debugging
  const state = navigation?.extras.state as { userId?: string; adId?: string };
  console.log('Router state:', state); // Debugging
  if (state?.userId) {
    this.userId = state.userId;
    console.log('Fetching advertisements for userId:', this.userId);
    
  } else if (state?.adId) {
    this.adId = state.adId;
    console.log('Fetching advertisement for adId:', this.adId);
    this._service.getIDAdvertisements(this.adId).subscribe(
      data => {
        this.userId=this._service.userId;
        this.advertisements = data;
        console.log("advertisment list for id: ",this.adId,this.advertisements)
      },
        error=>{console.log("error occured while retrieving the data for ID -",this.adId)
    });
  } else {
    console.log('Fetching all advertisement', this.adId);
    this.fetchadvertisement();
  }*/
  this._route.queryParams.subscribe(params => {
    this.userId = params['userId'];

    if (this.userId) {
      this.fetchUserAdvertisements(this.userId);
    } else {
      this.fetchadvertisement();
    }
  });

  /*this._route.params.subscribe(params => {
    const adId = params['id']; // Access ad ID from URL if provided
    const userId = params['userId']; // Access user ID from URL if provided
    if (this._router.getCurrentNavigation()?.extras.state) {
      const state = this._router.getCurrentNavigation()?.extras.state as { userId: string };
      this.userId = state.userId;
      console.log('User ID:', this.userId);
      
      this._service.getUserAdvertisements(userId).subscribe(
        data => {
          this.userId=this._service.userId;
          this.advertisements = data;
          console.log("advertisment list for userId: ",adId,this.advertisements)
        },
          error=>{console.log("error occurred while retrieving the data for userId -",userId)
      });
    } else if(this._router.getCurrentNavigation()?.extras.state) {
      const state = this._router.getCurrentNavigation()?.extras.state as { adId: string };
      this.adId = state.adId;
      console.log('adId ID:', this.adId);
      this._service.getIDAdvertisements(adId).subscribe(
        data => {
          this.userId=this._service.userId;
          this.advertisements = data;
          console.log("advertisment list for id: ",adId,this.advertisements)
        },
          error=>{console.log("error occured while retrieving the data for ID -",adId)
      });
    } else {
      this.fetchadvertisement()
    }
  });*/
  this.userId=this._service.userId;
}
fetchUserAdvertisements(userId:string){
  this._service.getUserAdvertisements(+this.userId).subscribe(
    data => {
      this.advertisements = data;
    },
      error=>{console.log("error occurred while retrieving the data for userId -",this.userId)
  });
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
  fetchDistinctHashtags() {
    this._service.getHashTags().subscribe(data => {
      this.chips = [{ label: 'All' }, ...data.map((hashtag:string) => ({ label: hashtag }))];
    });
  }
  onChipClick(index: number) {
    this.activeChipIndex = index;
    const selectedHashtag = this.chips[index].label;
    if (selectedHashtag === 'All') {
      this.fetchadvertisement();  // Fetch all advertisements
    } else {
      this.getHashTagsAdvertisement(selectedHashtag);  // Fetch advertisements by selected hashtag
    }
  }
  getHashTagsAdvertisement(query: string) {
    this._service.getHashTagsAdvertisement(query).subscribe(data => {
      this.advertisements = data;
    });
  }
  querySearch:boolean=false;
  onSearch(queryEvent: Event): void {
    const inputElement = queryEvent.target as HTMLInputElement;
    const query = inputElement.value?.trim();
    this.querySearch=true;
    if (!query.trim()) {
        this.querySearch = false;
    }
    this._service.getPincodesAdvertisement(query).subscribe(
      data => {
        this.userId=this._service.userId;
        this.advertisements = data;
      },
        error=>{console.log("error occurred while retrieving the data for query -",query)
    });
  }
  isMobileView:boolean=false;
  showSearchBox=false
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
      this.checkViewport();
  }
  checkViewport() {
    this.isMobileView = window.innerWidth <= 768;
    if(this.isMobileView){
      this.showSearchBox=false;
    }
  }
  toggleSearchBox(){
    this.showSearchBox=!this.showSearchBox
  }
}
