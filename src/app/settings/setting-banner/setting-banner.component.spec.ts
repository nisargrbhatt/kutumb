import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingBannerComponent } from './setting-banner.component';

describe('SettingBannerComponent', () => {
  let component: SettingBannerComponent;
  let fixture: ComponentFixture<SettingBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
