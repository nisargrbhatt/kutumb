import { NgModule } from '@angular/core';
import { AuthGuard } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { BlogCreateComponent } from './blog-create/blog-create.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogPersonalListComponent } from './blog-personal-list/blog-personal-list.component';
import { BlogShowComponent } from './blog-show/blog-show.component';

const routes: Routes = [
  {
    path: '',
    component: BlogListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create',
    component: BlogCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'update/:id',
    component: BlogCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'personal',
    component: BlogPersonalListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ':slug',
    component: BlogShowComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class BlogsRoutingModule {}
