import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { Blog } from 'src/app/interfaces/blog';
import { User } from 'src/app/interfaces/user';
import { SubSink } from 'subsink';
import { BlogsService } from '../blogs.service';
import slugify from 'slugify';
import { MatChipInputEvent } from '@angular/material/chips';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-blog-create',
  templateUrl: './blog-create.component.html',
  styleUrls: ['./blog-create.component.scss'],
})
export class BlogCreateComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  blogForm: FormGroup;

  editMode = false;
  blogId: string | any;
  blog: Blog | any;

  user: User | any;

  tags = new Set<string>([]);
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: MatSnackBar,
    private auth: AuthService,
    private blogsService: BlogsService
  ) {
    this.blogForm = new FormGroup({
      title: new FormControl('', {
        validators: [Validators.required],
      }),
      summary: new FormControl('', {
        validators: [Validators.required],
      }),
      content: new FormControl('', {
        validators: [Validators.required],
      }),
      published: new FormControl(false, {
        validators: [],
      }),
    });

    this.editor = new Editor();

    this.subs.sink = this.auth.user.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.editMode = true;
        this.blogId = paramMap.get('id');
        this.getBlogData();
      } else {
        this.editMode = false;
      }
    });
  }

  getBlogData(): void {
    this.subs.sink = this.blogsService
      .getBlog(this.blogId)
      .pipe(take(1))
      .subscribe((blog) => {
        this.blog = blog;
        this.blogForm.patchValue({
          title: blog.title,
          summary: blog.summary,
          content: blog.content,
          published: blog.published,
        });
        this.tags = new Set<string>(blog.tags);

        this.blogForm.get('title')?.disable();
      });
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.add(value);
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    this.tags.delete(tag);
  }

  onBlogFormSubmit(): void {
    if (this.blogForm.invalid) {
      return;
    }

    if (this.editMode) {
      if (!this.blogForm.dirty) {
        return;
      }

      this.blogsService
        .updateBlog(
          {
            summary: this.blogForm.value.summary,
            content: this.blogForm.value.content,
            published: this.blogForm.value.published,
          },
          this.blogId
        )
        .then(() => {
          this.snackbarService.open('Blog updated successfully', 'Ok', {
            duration: 2 * 1000,
          });
          this.router.navigate(['blog/', this.blog.slug]);
        })
        .catch((error) => {
          console.log(error);
          this.snackbarService.open('Blog updation failed', 'Ok', {
            duration: 2 * 1000,
          });
        });
    } else {
      this.blogsService
        .addBlog({
          title: this.blogForm.value.title,
          slug:
            slugify(this.blogForm.value.title, {
              replacement: '-',
              lower: true,
              locale: 'en',
              trim: true,
            }) +
            '-' +
            Date.now(),
          summary: this.blogForm.value.summary,
          content: this.blogForm.value.content,
          published: this.blogForm.value.published,
          tags: Array.from(this.tags),
          likes: [],
          comments: [],
          createdBy: this.user.uid,
          author: {
            userId: this.user.uid,
            displayName: this.user.displayName,
            email: this.user?.email,
            photoURL: this.user?.photoURL,
          },
          createdAt: new Date().toJSON(),
        })
        .then(() => {
          this.snackbarService.open('Blog created successfully', 'Ok', {
            duration: 2 * 1000,
          });
          this.router.navigate(['/blog']);
        })
        .catch((error) => {
          console.log(error);
          this.snackbarService.open('Blog creation failed', 'Ok', {
            duration: 2 * 1000,
          });
        });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.editor.destroy();
  }
}
