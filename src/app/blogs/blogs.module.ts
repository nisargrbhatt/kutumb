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
import { NgxEditorModule } from 'ngx-editor';

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
    NgxEditorModule.forRoot({
      locals: {
        // menu
        bold: 'Bold',
        italic: 'Italic',
        code: 'Code',
        underline: 'Underline',
        strike: 'Strike',
        blockquote: 'Blockquote',
        bullet_list: 'Bullet List',
        ordered_list: 'Ordered List',
        heading: 'Heading',
        h1: 'Header 1',
        h2: 'Header 2',
        h3: 'Header 3',
        h4: 'Header 4',
        h5: 'Header 5',
        h6: 'Header 6',
        align_left: 'Left Align',
        align_center: 'Center Align',
        align_right: 'Right Align',
        align_justify: 'Justify',
        text_color: 'Text Color',
        background_color: 'Background Color',
        insertLink: 'Insert Link',
        removeLink: 'Remove Link',
        insertImage: 'Insert Image',

        // pupups, forms, others...
        url: 'URL',
        text: 'Text',
        openInNewTab: 'Open in new tab',
        insert: 'Insert',
        altText: 'Alt Text',
        title: 'Title',
        remove: 'Remove',
      },
    }),
  ],
  providers: [DatePipe],
})
export class BlogsModule {}
