import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AngularMaterialModule } from '../angular-material.module';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  declarations: [UserProfileComponent],
  imports: [CommonModule, AngularMaterialModule, ProfileRoutingModule],
})
export class ProfileModule {}
