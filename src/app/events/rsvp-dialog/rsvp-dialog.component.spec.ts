import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsvpDialogComponent } from './rsvp-dialog.component';

describe('RsvpDialogComponent', () => {
  let component: RsvpDialogComponent;
  let fixture: ComponentFixture<RsvpDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsvpDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsvpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
