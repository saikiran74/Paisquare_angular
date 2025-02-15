import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PaiService } from '../../paisa.service';
import { Contactus } from '../../paisa';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent {
  contactus= new Contactus();
  message=''
  isLoggedIn:boolean=false;
  userName=''
  userId: Number|undefined;
  constructor(private _service: PaiService,private _router: Router) {}
  ngOnInit(): void {
    this.userId = this._service.userId;
    if (this.userId) {
      this.isLoggedIn=true;
    }
  }
  contactusForm(){
    this.contactus.userid=this._service.userId;
    this.contactus.username=this._service.userName;
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
        if(this.isLoggedIn){
          this._router.navigate(['contactus'])
        }
        else
          this._router.navigate([''])
      },
        error=>{console.log(this.contactus);
        this.message="Invalid details";
      }
      )
    }
  }
}
