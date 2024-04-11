import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertiserreportsComponent } from './advertiserreports.component';

describe('AdvertiserreportsComponent', () => {
  let component: AdvertiserreportsComponent;
  let fixture: ComponentFixture<AdvertiserreportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvertiserreportsComponent]
    });
    fixture = TestBed.createComponent(AdvertiserreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
