import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SettingComponent } from './setting/setting.component';
import { SettingBannerComponent } from './setting-banner/setting-banner.component';
import { SettingUserComponent } from './setting-user/setting-user.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  declarations: [
    SettingComponent,
    SettingBannerComponent,
    SettingUserComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    NgbModule,
    SettingsRoutingModule,
  ],
})
export class SettingsModule {}
