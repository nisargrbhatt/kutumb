import { NgModule } from '@angular/core';
import { AuthGuard } from '@angular/fire/auth-guard';
import { Routes, RouterModule } from '@angular/router';
import { SpecialGuard } from '../core/special.guard';
import { EventCreateComponent } from './event-create/event-create.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventShowComponent } from './event-show/event-show.component';

const routes: Routes = [
  {
    path: '',
    component: EventListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create',
    component: EventCreateComponent,
    canActivate: [AuthGuard, SpecialGuard],
  },
  {
    path: 'update/:id',
    component: EventCreateComponent,
    canActivate: [AuthGuard, SpecialGuard],
  },
  {
    path: ':id',
    component: EventShowComponent,
    canActivate: [AuthGuard, SpecialGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, SpecialGuard],
})
export class EventsRoutingModule {}
