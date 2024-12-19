import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiSquareRightSideAdvertisementComponent } from './pai-square-right-side-advertisement.component';

describe('PaiSquareRightSideAdvertisementComponent', () => {
  let component: PaiSquareRightSideAdvertisementComponent;
  let fixture: ComponentFixture<PaiSquareRightSideAdvertisementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaiSquareRightSideAdvertisementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaiSquareRightSideAdvertisementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
