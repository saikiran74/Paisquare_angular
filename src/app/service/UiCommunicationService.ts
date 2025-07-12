import { Subject } from 'rxjs';
import { Injectable, Component, OnInit, Input, HostListener } from '@angular/core';
import { PaiService} from '../paisa.service';
import { Advertise } from '../paisa';
@Injectable({ providedIn: 'root' })
export class UiCommunicationService {
  
  constructor(private _service: PaiService) { }
    
  advertisements: Advertise[] = [];
  private searchToggleSource = new Subject<void>();
  private filterToggleSource = new Subject<void>();

  searchToggle$ = this.searchToggleSource.asObservable();
  filterToggle$ = this.filterToggleSource.asObservable();

  toggleSearchBox() {
    this.searchToggleSource.next();
  }

  toggleFilterBox() {
    this.filterToggleSource.next();
  }

  fetchadvertisement() {
    this._service.getAllAdvertisements().subscribe(
      data => {
        this.advertisements = data.reverse();
        if (this.advertisements.length > 0) {
          
        }
      },
      error => {
        console.log("error occur while retrieving the data!")
      }
    );
  }
}
