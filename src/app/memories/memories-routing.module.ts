import { NgModule } from '@angular/core';
import { AuthGuard } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { MemoriesCreateComponent } from './memories-create/memories-create.component';
import { MemoriesShowComponent } from './memories-show/memories-show.component';

const routes: Routes = [
  {
    path: '',
    component: MemoriesShowComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create',
    component: MemoriesCreateComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class MemoriesRoutingModule {}
