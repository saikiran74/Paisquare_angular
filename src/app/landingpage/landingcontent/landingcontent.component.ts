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
    function setRealHeight() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    window.addEventListener('resize', setRealHeight);
    setRealHeight();
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
    this.contactus.userid=this._service.userId;
    this.contactus.username=this._service.userName;
    if(this.contactus.name==''){
      this.message="Please enter your name";
      this.errorMessage=true;
    } else if (this.contactus.name.length>30) {
      this.message = "Enter your name less than 30 characters";
      this.errorMessage = true;
    }
    else if(this.contactus.email==''){
      this.message="Please enter your email";      
      this.errorMessage=true;
    } else if (!this.isValidEmail(this.contactus.email)) {
      this.message = "Please enter a valid email address";
      this.errorMessage = true;
    } else if (!this.isValidMobileNumber(this.contactus.mobilenumber)) {
      this.message = "Please enter valid number";
      this.errorMessage = true;
    }
    else if(this.contactus.issue==''){
      this.message="Please enter your query";      
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
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  }
  isValidMobileNumber(mobile: string): boolean {
    const mobileRegex = /^[1-9]\d{9}$/;
    return mobileRegex.test(mobile);
  }
  
}

