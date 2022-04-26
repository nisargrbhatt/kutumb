import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemoriesRoutingModule } from './memories-routing.module';
import { AngularMaterialModule } from '../angular-material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MemoriesShowComponent } from './memories-show/memories-show.component';
import { ScrollableDirective } from '../directives/scrollable.directive';
import { MemoriesCreateComponent } from './memories-create/memories-create.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    MemoriesShowComponent,
    ScrollableDirective,
    MemoriesCreateComponent,
  ],
  imports: [
    CommonModule,
    MemoriesRoutingModule,
    AngularMaterialModule,
    NgbModule,
  ],
  providers: [CookieService],
})
export class MemoriesModule {}
