// ui-communication.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiCommunicationService {
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
}
