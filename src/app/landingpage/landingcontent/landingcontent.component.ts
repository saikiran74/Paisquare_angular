import { Component, OnInit, HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { PaiService } from '../../paisa.service';
import { Contactus } from '../../paisa';

@Component({
  selector: 'app-landingcontent',
  templateUrl: './landingcontent.component.html',
  styleUrls: ['./landingcontent.component.css']
})
export class LandingcontentComponent implements OnInit {
border: any;

  contactus= new Contactus();
  message=''
  errorMessage:boolean=false;
  isLoggedIn:boolean=false;
  userName=''
  userId: Number|undefined;
  constructor(private _service: PaiService,private _router: Router) {}
  
  ngOnInit(): void {
    this.checkViewport();
    this.userId = this._service.userId;
    if (this.userId) {
      this.isLoggedIn=true;
    }
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
  
  contactusForm(){
    console.log("contactusForm")
    this.contactus.userid=this._service.userId;
    this.contactus.username=this._service.userName;
    if(this.contactus.name==null){
      this.message="please enter your name";
      this.errorMessage=true;
    }
    else if(this.contactus.email==null){
      this.message="please enter your email";      
      this.errorMessage=true;

    }
    else if(this.contactus.issue==null){
      this.message="please enter your query";      
      this.errorMessage=true;

    }
    else{
      this._service.ContactusFromRemote(this.contactus).subscribe(
        data=>{console.log("Response received");
          this.errorMessage=false;
          this.message="Thank you for contacting us.";
          this.contactus.name='';
          this.contactus.email='';
          this.contactus.mobilenumber='';
          this.contactus.issue='';
          this._router.navigate([''])
        },
          error=>{console.log(this.contactus);
          this.message="Invalid details";
        }
      )
    }
  }
}

