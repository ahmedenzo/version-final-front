import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmptppopupComponent } from './smptppopup.component';

describe('SmptppopupComponent', () => {
  let component: SmptppopupComponent;
  let fixture: ComponentFixture<SmptppopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmptppopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmptppopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
