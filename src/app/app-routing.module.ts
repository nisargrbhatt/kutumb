import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@angular/fire/auth-guard';
import { BannerComponent } from './home/banner/banner.component';
import { AdminGuard } from './core/admin.guard';
import { SpecialGuard } from './core/special.guard';
import { Error404Component } from './error404/error404.component';

const routes: Routes = [
  {
    path: '',
    component: BannerComponent,
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsModule),
  },
  {
    path: 'event',
    loadChildren: () =>
      import('./events/events.module').then((m) => m.EventsModule),
  },
  {
    path: 'memories',
    loadChildren: () =>
      import('./memories/memories.module').then((m) => m.MemoriesModule),
  },
  {
    path: 'blog',
    loadChildren: () =>
      import('./blogs/blogs.module').then((m) => m.BlogsModule),
  },
  {
    path: 'payments',
    loadChildren: () =>
      import('./payments/payments.module').then((m) => m.PaymentsModule),
  },
  {
    path: '**',
    component: Error404Component,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard, SpecialGuard],
})
export class AppRoutingModule {}
