import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogPersonalListComponent } from './blog-personal-list.component';

describe('BlogPersonalListComponent', () => {
  let component: BlogPersonalListComponent;
  let fixture: ComponentFixture<BlogPersonalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogPersonalListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogPersonalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
