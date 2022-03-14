import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserResponseTableComponent } from './user-response-table.component';

describe('UserResponseTableComponent', () => {
  let component: UserResponseTableComponent;
  let fixture: ComponentFixture<UserResponseTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserResponseTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserResponseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
