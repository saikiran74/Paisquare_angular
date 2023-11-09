import { Component } from '@angular/core';
import { PaiService } from '../../paisa.service';
import { Router } from '@angular/router';
import { Advertise } from '../../paisa';
@Component({
  selector: 'app-advertisementform',
  templateUrl: './advertisementform.component.html',
  styleUrls: ['./advertisementform.component.css']
})
export class AdvertisementformComponent {
  advertise= new Advertise();
  message=''
  constructor(private _service: PaiService, private _router: Router){};

  advertisementForm(){
    this._service.advertiseFromRemote(this.advertise,this._service.userId).subscribe(
      data=>{console.log("Response received");
      this._router.navigate(['homepage'])
    },
      error=>{console.log(this.advertise);
        console.log("not saved");
      this.message="Invalid details";
    }
      
    )
  }

}
