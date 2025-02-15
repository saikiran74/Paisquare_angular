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

  constructor() { }

  ngOnInit(): void {
    this.checkViewport();
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
}

