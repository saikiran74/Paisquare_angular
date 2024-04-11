import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertiserdashboardComponent } from './advertiserdashboard.component';

describe('AdvertiserdashboardComponent', () => {
  let component: AdvertiserdashboardComponent;
  let fixture: ComponentFixture<AdvertiserdashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvertiserdashboardComponent]
    });
    fixture = TestBed.createComponent(AdvertiserdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
