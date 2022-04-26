import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoriesCreateComponent } from './memories-create.component';

describe('MemoriesCreateComponent', () => {
  let component: MemoriesCreateComponent;
  let fixture: ComponentFixture<MemoriesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemoriesCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoriesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
