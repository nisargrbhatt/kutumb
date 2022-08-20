import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './banner/banner.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMaterialModule } from '../angular-material.module';
import { RouterModule } from '@angular/router';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
  declarations: [BannerComponent],
  imports: [
    CommonModule,
    NgbModule,
    AngularMaterialModule,
    RouterModule,
    SlickCarouselModule,
  ],
})
export class HomeModule {}
