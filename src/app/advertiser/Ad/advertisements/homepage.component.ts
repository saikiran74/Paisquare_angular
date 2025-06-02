import { Component, OnInit,Input, ChangeDetectorRef,EventEmitter, Output } from '@angular/core';
import { PaiService } from '../../../paisa.service';
import {HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../service/auth-service.service';
import { Comments,Follower,Visited,Like, Block, Report,Favourite } from '../../../paisa';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  @Input() ad: any;
  options = [
    { id: 'radio1', label: 'Violent', value: 'violent' },
    { id: 'radio2', label: 'Hateful', value: 'Hateful' },
    { id: 'radio3', label: 'Harassment', value: 'Harassment' },
    { id: 'radio4', label: 'harmful', value: 'harmful' },
    { id: 'radio5', label: 'Misinformation', value: 'Misinformation' },
    { id: 'radio6', label: 'Child Abuse', value: 'Child Abuse' },
    { id: 'radio7', label: 'Spam/ Misleading', value: 'Spam/Misleading' }
  ];
  advertisements: any[] = [];
  advertisementsListById: any[] = [];
  comments: any[] = [];
  latestFiveComments: any[] = [];
  followersuseridlist: any[]=[];
  followerslist: any[] = [];
  userData: any[] = [];
  blockedlist: any[]=[];
  commentobj= new Comments();
  followerobj= new Follower();
  visitobj=new Visited();
  blockobj=new Block();
  favouriteobj=new Favourite();
  message=''
  showComments=''
  currentOpenId: any;
  currentOpenLocationId: any;
  following:any;
  advertisementid:any=0;
  showAllCommentsDialog =false;
  isExpanded = false;
  showMenu = false;
  constructor(private cdr: ChangeDetectorRef,private authService: AuthService,private _service: PaiService,private http: HttpClient,private _router: Router,private _route: ActivatedRoute) {
       
  }
  userId=' ';
  displayDialog: boolean = false;
  isAuthenticated: boolean = false;
  showDialog() {
    this.displayDialog = true;
  }
  @Output() fetchData = new EventEmitter<void>();
  ngOnInit(){
    this.isAuthenticated = this.authService.isAuthenticated();
    this._route.params.subscribe(params => {
      const adId = params['id']; // Access ad ID from URL if provided
      const userId = params['userId']; // Access user ID from URL if provided
  
      if (adId) {
        // Fetch and display specific ad by ID
        this._service.getIDAdvertisements(adId).subscribe(
          data => {
            this.userId=this._service.userId;
            this.advertisements = data;
            
          },
            error=>{console.log("error occure while retrieving the data for ID -",adId)
        });
      } else if (userId) {
        // Fetch and display ads by user
        this._service.getUserAdvertisements(userId).subscribe(
          data => {
            this.userId=this._service.userId;
            this.advertisements = data;
          },
            error=>{console.log("error occure while retrieving the data for userId -",userId)
        });
      } else {
        this.fetchadvertisement()
      }
    });
    this.userId=this._service.userId;
    if(this.authService.isAuthenticated()){
      this.fetchUserData();
    }
  }
  fetchUserData(){
    this._service.getUserdata(+this.userId).subscribe(
      data =>{
        this.userData=data;
        this.followerslist=data.following;
        this.blockedlist=data.blocked;
      },
      error=>{
        console.log("error occured in followerslist")
      }
    );
  }
  fetchadvertisement(){
    this._service.getAllAdvertisements().subscribe(
      data => {
        this.userId=this._service.userId;
        this.advertisements = data;
        this.cdr.detectChanges();
      },
      error=>{console.log("error occur while retrieving the data!")
    });
  }

  selectedOption='';
  selectOptionText='';
  reportobj=new Report();
  reportmessage='';
  Reportadvertisement(advertisementId:Number) {
    this.reportobj.advertisementid=advertisementId;
    this.reportobj.userid=this.userId;
    if(this.selectedOption==='none')
      this.reportobj.reportedtext=this.selectOptionText;
    else
      this.reportobj.reportedtext=this.selectedOption;
    if(this.reportobj.reportedtext!==''){
      this._service.postReportadvertisement(this.reportobj).subscribe(
        data=>{
          this.fetchUserData()
          this.showReportDialog=false;
        },
        error=>{
          console.log("error occured while reporting");
        }
      )
    }
    else{
      this.reportmessage="Select correct option";
    }
    this.selectedOption='';
    this.selectOptionText='';
    
  }


  likeobj=new Like();
  like(advertisementid:Number){
    this.likeobj.visited=false;
    this._service.LikeFromRemote(this.likeobj,+this.userId,advertisementid).subscribe(
      data=>{
        this.fetchData.emit();
        //this.fetchadvertisement()
      },
      error=>{
        console.log("like error occured")
      }
    )
  }
  visited(advertisementid:Number,advertisementurl:String){
    this.visitobj.userid=this.userId;
    this.visitobj.visited=true;
    if(this.isAuthenticated){
      this._service.VisitedFromRemote(this.visitobj,+this.userId,advertisementid).subscribe(
        data=>{
          this.fetchData.emit();
          //this._router.navigate(['alladvertisements'])
        },
        error=>{
          console.log("visited error occured")
        }
      )
    }
    
  }
  block(advertiserid: number){
    this.blockobj.userid=this._service.userId;
    this.blockobj.advertiserid=advertiserid;
    this.blockobj.blocked=true;
    this._service.postBlockAdvertiser(this.blockobj,this._service.userId,advertiserid).subscribe(
      data=>{
        this.fetchUserData()
        this.fetchData.emit();
      },
      error=>{
        console.log("error occured while blocking advertiser")
      }
    )
  }
  favourite(advertisementid: number){
    this._service.postfavouriteAdvertisement(this.favouriteobj,this._service.userId,advertisementid).subscribe(
      data=>{
        this.fetchData.emit();
      },
      error=>{
        console.log("error occured while adding advertisement added favourites")
      }
    )
  }
 
  follower(advertiserid: number){
    if (this.followerslist.includes(advertiserid)) {
      this.followerslist = this.followerslist.filter(id => id !== advertiserid);
    } else {
        this.followerslist = [...this.followerslist, advertiserid];
    }
    this.followerobj.following=true;
    this._service.FollowerFromRemote(this.followerobj,advertiserid,+this.userId).subscribe(
      data=>{
        // removed below code to avoid glitch while clicking like and follow button
        //this.fetchUserData()
        //this.fetchData.emit();
        //this._router.navigate(['homepage'])
      },
      error=>{
        console.log("error occured for following");
      }
    )
  }
  comment(val:Number){
    this.commentobj.userid=this.userId;
    this.commentobj.advertisementid=val;
    this.commentobj.adid=val;
    if(this.commentobj.comment.length<1){
        const commentErrorMessage="Please enter comment"
    }
    this._service.CommentsFromRemote(this.commentobj,val,+this.userId).subscribe(
      data=>{
      //console.log("Response received");
      this.fetchData.emit();
      //this._router.navigate(['homepage'])
      this.commentlist(val)
      this.commentobj= new Comments();
      this.fetchadvertisement();
    },
      error=>{console.log("Error occured");
    }
    )
  }
  
  locationBox(advertisementid:Number){
    if (this.currentOpenLocationId === advertisementid) {
      this.currentOpenLocationId = null;
    } else {
      this.currentOpenLocationId = advertisementid;
    }
  }
  
  commentlist(advertisementid:Number){
    if (this.currentOpenId === advertisementid) {
      this.currentOpenId = null;
    } else {
      this.currentOpenId = advertisementid;
    }
    this.comments = [];
    this._service.CommentsListFromRemote(advertisementid).subscribe(
      data=>{
        const reversed = [...data].reverse();
        this.comments=reversed;
        this.latestFiveComments= reversed.slice(0,5); 
    },
      error=>{console.log("Error occured");
    }
    )
  }
  Shareadvertisement(advertisementid:number){
    this._service.getSingleAdvertisement(advertisementid).subscribe(
      data=>{
        if (data) {
          const title = data.brandname;
          const text = this.stripHtmlTags(data.description);
          const url = "https://paisquare.com/advertisements/"+data.id+"/"+data.slug;
          console.log("url",url)
          this.share(title, text, url);
        } else {
          console.log("Advertisement not found");
        }
      },
      error=>{
        console.log("Error occured");
      }
    )
  }
  async share(title: string, text: string, url: string) {
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        console.log('Web Share API not supported');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }
  // Function to remove HTML tags
  stripHtmlTags(html: string): string {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }
  profile(advertiserid:Number){
    this._router.navigate(['profile',this._service.userId])
  }

  editAdvertisement(advertisementid:Number){
    this._router.navigate([`/home/edit/${advertisementid}`]);
  }
  showReportDialog:boolean=false;
  advertisementId:number=0;
  showReportDialogBox(advertisementId:number){
    this.showReportDialog=true
    this.advertisementId=advertisementId;
  }
  /*
  visitProfile(id:number){
    this._router.navigate(['visit/profile', id]);
  }*/
    visitProfile(id:number){
      this._router.navigate(['profile/visit', 'advertiser', id]);
    }
  openChat(Id: number, Name: string): void {
    this._router.navigate(['/user/chat'], { 
      queryParams: { userId: Id, name: Name }
    });
  }







  get timeAgo(): string {
    if (!this.ad?.opendate) return 'Recently';

    const opendate = new Date(this.ad.opendate);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - opendate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return opendate.toLocaleDateString();
    }
  }

  get daysLeft(): number | null {
    if (!this.ad.expiresAt) return null;
    const diffMs = new Date(this.ad.expiresAt).getTime() - new Date().getTime();
    return diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : null;
  }
  outsideClick() {
    this.showMenu = false;
  }
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
  showLocation = false;
  toggleLocation() {
    this.showLocation = !this.showLocation;
  }
}
