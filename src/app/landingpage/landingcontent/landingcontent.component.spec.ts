import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingcontentComponent } from './landingcontent.component';

describe('LandingcontentComponent', () => {
  let component: LandingcontentComponent;
  let fixture: ComponentFixture<LandingcontentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingcontentComponent]
    });
    fixture = TestBed.createComponent(LandingcontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
