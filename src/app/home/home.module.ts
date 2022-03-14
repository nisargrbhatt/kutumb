import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './banner/banner.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
  declarations: [BannerComponent],
  imports: [CommonModule, NgbModule, AngularMaterialModule],
})
export class HomeModule {}
