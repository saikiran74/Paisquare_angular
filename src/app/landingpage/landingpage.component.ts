import { Component , ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contactus } from '../paisa';
import { PaiService } from '../paisa.service';
import { LandingnavbarComponent } from './landingnavbar/landingnavbar.component';
@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent {
  valueFromChild:string= '';
  temp='signin'
}
