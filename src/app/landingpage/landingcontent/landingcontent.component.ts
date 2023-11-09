import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PaiService } from '../../paisa.service';
import { Contactus } from '../../paisa';

@Component({
  selector: 'app-landingcontent',
  templateUrl: './landingcontent.component.html',
  styleUrls: ['./landingcontent.component.css']
})
export class LandingcontentComponent {
  
  contactus= new Contactus();
  message=''
  constructor(private _service: PaiService,private _router: Router) {}
  contactusForm(){
    if(this.contactus.name==null){
      this.message="please enter your name";
    }
    else if(this.contactus.email==null){
      this.message="please enter your email";
    }
    else if(this.contactus.issue==null){
      this.message="please enter your query";
    }
    else{
      this._service.ContactusFromRemote(this.contactus).subscribe(
        data=>{console.log("Response received");
        this.message="Thank you for contacting us. Will get back to you soon!";
        this._router.navigate([''])
      },
        error=>{console.log(this.contactus);
          console.log("not saved");
        this.message="Invalid details";
      }
      )
    }
  }
}
