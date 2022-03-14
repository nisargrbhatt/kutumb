import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EventCreateComponent } from './event-create/event-create.component';
import { EventShowComponent } from './event-show/event-show.component';
import { EventListComponent } from './event-list/event-list.component';
import { RouterModule } from '@angular/router';
import { RsvpDialogComponent } from './rsvp-dialog/rsvp-dialog.component';
import { UserResponseTableComponent } from './user-response-table/user-response-table.component';
import { EventsRoutingModule } from './events-routing.module';

@NgModule({
  declarations: [
    EventCreateComponent,
    EventShowComponent,
    EventListComponent,
    RsvpDialogComponent,
    UserResponseTableComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    NgbModule,
    RouterModule,
    EventsRoutingModule,
  ],
  providers: [DatePipe],
})
export class EventsModule {}
