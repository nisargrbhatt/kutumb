import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { UserProfileComponent } from './profile/user-profile/user-profile.component';
import { AuthGuard } from '@angular/fire/auth-guard';
import { BannerComponent } from './home/banner/banner.component';
import { AdminGuard } from './core/admin.guard';
// import { SettingComponent } from './settings/setting/setting.component';
// import { EventListComponent } from './events/event-list/event-list.component';
// import { EventCreateComponent } from './events/event-create/event-create.component';
import { SpecialGuard } from './core/special.guard';
// import { EventShowComponent } from './events/event-show/event-show.component';

const routes: Routes = [
  {
    path: '',
    component: BannerComponent,
  },
  // {
  //   path: 'profile',
  //   component: UserProfileComponent,
  //   canActivate: [AuthGuard],
  // },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  // {
  //   path: 'settings',
  //   component: SettingComponent,
  //   canActivate: [AuthGuard, AdminGuard],
  // },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsModule),
  },
  // {
  //   path: 'event',
  //   component: EventListComponent,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'event/create',
  //   component: EventCreateComponent,
  //   canActivate: [AuthGuard, SpecialGuard],
  // },
  // {
  //   path: 'event/update/:id',
  //   component: EventCreateComponent,
  //   canActivate: [AuthGuard, SpecialGuard],
  // },
  // {
  //   path: 'event/:id',
  //   component: EventShowComponent,
  //   canActivate: [AuthGuard, SpecialGuard],
  // },
  {
    path: 'event',
    loadChildren: () =>
      import('./events/events.module').then((m) => m.EventsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard, SpecialGuard],
})
export class AppRoutingModule {}
