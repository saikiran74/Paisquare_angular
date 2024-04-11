import { Component, OnInit } from '@angular/core';
import { PaiService} from '../../paisa.service';
import { error } from 'jquery';

@Component({
  selector: 'app-advertiserdashboard',
  templateUrl: './advertiserdashboard.component.html',
  styleUrls: ['./advertiserdashboard.component.css']
})
export class AdvertiserdashboardComponent implements OnInit{
  cash:any=''
  money=''
  pai=''
  advertisement:any[]=[];
  constructor(private _service: PaiService) {
  }
  ngOnInit() {
    this._service.getUserdata(this._service.userId).subscribe(
      data=>{
        console.log(data)
        data.forEach((user:any)=>{
          this.money=user.paisa
          this.pai=user.pai
        });
      },
      error=>{
        console.log("error occured while retreiving the user data!")
      }
    )
    this._service.getUserAdvertisements(this._service.userId).subscribe(
      data=>{
        console.log("getAdvertisementTransactionData",data)
        this.advertisement=data.slice().reverse();
      },
      error=>{
        console.log("error occured while retreiving the user data!")
      }
    )
  }

}
