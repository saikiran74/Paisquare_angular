import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landingnavbar',
  templateUrl: './landingnavbar.component.html',
  styleUrls: ['./landingnavbar.component.css']
})
export class LandingnavbarComponent {
  constructor(private _router: Router) {}
  @Output() valueEvent = new EventEmitter<string>();

  
  navigateToLogin() {
    this._router.navigate(['login']);
  }
  navigateToCreateaccount(){
    this._router.navigate(['createaccount']);
  }
}
