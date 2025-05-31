import { Component, OnInit, HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { PaiService } from '../../paisa.service';
import { Contactus,URLs } from '../../paisa';
interface Step {
  step: number;
  title: string;
  description: string;
  icon: string;
}
@Component({
  selector: 'app-landingcontent',
  templateUrl: './landingcontent.component.html',
  styleUrls: ['./landingcontent.component.css']
})
export class LandingcontentComponent implements OnInit {
  
  advertiserbenefits = [
    {
      icon: '💰',
      title: 'Post Ads Free or with PAI Coins',
      description: 'Start with free basic ads or use PAI Coins for premium features and enhanced visibility.'
    },
    {
      icon: '🎯',
      title: 'Precise Targeting',
      description: 'Target your audience by gender, age, location, and interests for maximum impact.'
    },
    {
      icon: '🔍',
      title: 'Google SEO Benefits',
      description: 'Boost your search rankings with our integrated SEO optimization features.'
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Track performance, engagement, and ROI with comprehensive analytics dashboard.'
    },
    {
      icon: '🚀',
      title: 'Instant Publishing',
      description: 'Get your ads live immediately with our streamlined publishing process.'
    },
    {
      icon: '💬',
      title: 'Direct Communication',
      description: 'Chat directly with engaged users without any middlemen or intermediaries.'
    }
  ];
  userBenefits = [
    {
      icon: "💵",
      title: "Earn Money & PAI Coins",
      description: "Get rewarded for every interaction - view, like, comment, share, or block ads to earn real money."
    },
    {
      icon: "👆",
      title: "Interactive Engagement",
      description: "Like, comment, share, or block ads based on your preferences and get paid for honest feedback."
    },
    {
      icon: "🎨",
      title: "Personalized Ad Feed",
      description: "Discover ads tailored to your interests, location, and preferences for a better experience."
    },
    {
      icon: "💱",
      title: "Sell PAI Coins",
      description: "Convert your earned PAI Coins to real money through our secure marketplace."
    },
    {
      icon: "🌍",
      title: "Local & Global Deals",
      description: "Find amazing deals and offers from local businesses and global brands near you."
    },
    {
      icon: "🛡️",
      title: "Privacy Control",
      description: "Full control over your data and ad preferences with robust privacy protection."
    }
  ];
  categories = [
    { icon: '✈️', title: 'Travel', description: 'Hotels, flights, tours' },
    { icon: '🏥', title: 'Health & Wellness', description: 'Hospitals, gyms, spas' },
    { icon: '🌾', title: 'Agriculture', description: 'Seeds, tools, farming' },
    { icon: '🎓', title: 'Education', description: 'Courses, schools, training' },
    { icon: '🎉', title: 'Events', description: 'Conferences, parties, shows' },
    { icon: '🏪', title: 'Local Businesses', description: 'Restaurants, shops, services' },
    { icon: '💼', title: 'Freelancers', description: 'Consultants, designers, writers' },
    { icon: '❤️', title: 'NGOs & Nonprofits', description: 'Charities, causes, awareness' }
  ];

  advertiserSteps: Step[] = [
    { step: 1, title: 'Sign Up', description: 'Create your advertiser account in minutes', icon: '📝' },
    { step: 2, title: 'Post Ad', description: 'Upload your ad with targeting preferences', icon: '📢' },
    { step: 3, title: 'Get Leads', description: 'Receive real-time engagement and analytics', icon: '📈' }
  ];

  userSteps: Step[] = [
    { step: 1, title: 'Browse', description: 'Explore personalized ads in your feed', icon: '👀' },
    { step: 2, title: 'Engage', description: 'Like, comment, share or provide feedback', icon: '👆' },
    { step: 3, title: 'Earn', description: 'Collect PAI Coins and convert to real money', icon: '💰' }
  ];
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
    console.log(this.contactus.mobilenumber)
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
    console.log(mobile)
    const mobileRegex = /^[1-9]\d{9}$/;
    return mobileRegex.test(mobile);
  }
  goToFaq() {
    window.open(URLs.FAQ, '_blank');
  }
  
  
  
}

