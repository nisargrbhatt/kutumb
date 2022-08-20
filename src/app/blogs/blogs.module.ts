import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BlogsRoutingModule } from './blogs-routing.module';
import { AngularMaterialModule } from '../angular-material.module';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BlogCreateComponent } from './blog-create/blog-create.component';
import { BlogPersonalListComponent } from './blog-personal-list/blog-personal-list.component';
import { BlogShowComponent } from './blog-show/blog-show.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [
    BlogCreateComponent,
    BlogPersonalListComponent,
    BlogShowComponent,
    BlogListComponent,
  ],
  imports: [
    CommonModule,
    BlogsRoutingModule,
    AngularMaterialModule,
    RouterModule,
    NgbModule,
    CKEditorModule,
  ],
  providers: [DatePipe],
})
export class BlogsModule {}
