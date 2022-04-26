import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoriesShowComponent } from './memories-show.component';

describe('MemoriesShowComponent', () => {
  let component: MemoriesShowComponent;
  let fixture: ComponentFixture<MemoriesShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemoriesShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoriesShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
