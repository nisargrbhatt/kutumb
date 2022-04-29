import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogShowComponent } from './blog-show.component';

describe('BlogShowComponent', () => {
  let component: BlogShowComponent;
  let fixture: ComponentFixture<BlogShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
