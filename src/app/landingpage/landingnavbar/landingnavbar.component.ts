import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landingnavbar',
  templateUrl: './landingnavbar.component.html',
  styleUrls: ['./landingnavbar.component.css']
})
export class LandingnavbarComponent {
  currentRoute: string = '';
  constructor(private _router: Router) {
    this._router.events.subscribe(() => {
      this.currentRoute = this._router.url;
    });
  }
  @Output() valueEvent = new EventEmitter<string>();

  
  navigateToLogin() {
    this._router.navigate(['login']);
  }
  navigateToCreateaccount(){
    this._router.navigate(['createaccount']);
  }
}
