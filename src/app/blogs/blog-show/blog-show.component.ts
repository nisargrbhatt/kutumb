import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { Blog, BlogComment } from 'src/app/interfaces/blog';
import { User } from 'src/app/interfaces/user';
import { SubSink } from 'subsink';
import { BlogsService } from '../blogs.service';

@Component({
  selector: 'app-blog-show',
  templateUrl: './blog-show.component.html',
  styleUrls: ['./blog-show.component.scss'],
})
export class BlogShowComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  blog: Blog | undefined;

  user: User | undefined;

  slug: string | any;

  commentFormControl = new FormControl('');

  constructor(
    private blogsService: BlogsService,
    private snackbarService: MatSnackBar,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.subs.sink = this.auth.user.subscribe((user) => {
      this.user = user;
    });

    this.subs.sink = this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('slug')) {
        this.slug = paramMap.get('slug');
        this.getBlog();
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  getBlog(): void {
    this.subs.sink = this.blogsService
      .getBlogFromSlug(this.slug)
      .pipe(map((blogs) => blogs[0]))
      .subscribe((blog) => {
        this.blog = blog;
      });
  }

  ngOnInit(): void {}

  checkAuthor(): boolean {
    if (this.blog && this.user) {
      return this.blog.createdBy === this.user.uid;
    } else {
      return false;
    }
  }

  checkUser(id: string): boolean {
    return id === this.user?.uid;
  }

  checkLike(): boolean {
    if (this.blog && this.user) {
      return this.blog?.likes.includes(this.user.uid);
    } else {
      return false;
    }
  }

  addLike(): void {
    if (this.blog?.id && this.user?.uid) {
      this.blogsService
        .addLikes(this.user.uid, this.blog.id)
        .then(() => {
          this.snackbarService.open('Blog liked successfully', 'Ok', {
            duration: 2 * 1000,
          });
        })
        .catch((error) => {
          console.log(error);
          this.snackbarService.open('Blog liked failed', 'Ok', {
            duration: 2 * 1000,
          });
        });
    }
  }

  deleteLike(): void {
    if (this.blog?.id && this.user?.uid) {
      this.blogsService
        .deleteLikes(this.user.uid, this.blog.id)
        .then(() => {
          this.snackbarService.open('Blog unliked successfully', 'Ok', {
            duration: 2 * 1000,
          });
        })
        .catch((error) => {
          console.log(error);
          this.snackbarService.open('Blog unliked failed', 'Ok', {
            duration: 2 * 1000,
          });
        });
    }
  }

  addComment(): void {
    const comment = this.commentFormControl.value.trim();
    if (comment.length < 1) {
      return;
    }
    if (this.blog?.id && this.user?.uid) {
      this.blogsService
        .addBlogComment(
          {
            createdAt: new Date().toJSON(),
            message: comment,
            user: {
              displayName: this.user.displayName,
              userId: this.user?.uid,
              email: this.user?.email,
              photoURL: this.user?.photoURL,
            },
          },
          this.blog.id
        )
        .then(() => {
          this.commentFormControl.reset();
          this.snackbarService.open('Comment inserted successfully', 'Ok', {
            duration: 2 * 1000,
          });
        })
        .catch((error) => {
          console.log(error);
          this.snackbarService.open('Comment insertion failed', 'Ok', {
            duration: 2 * 1000,
          });
        });
    }
  }

  deleteComment(comment: BlogComment): void {
    if (this.blog?.id) {
      this.blogsService
        .deleteBlogComment(comment, this.blog.id)
        .then(() => {
          this.snackbarService.open('Comment deleted successfully', 'Ok', {
            duration: 2 * 1000,
          });
        })
        .catch((error) => {
          console.log(error);
          this.snackbarService.open('Comment deletion failed', 'Ok', {
            duration: 2 * 1000,
          });
        });
    }
  }

  deleteBlog(): void {
    if (this.blog?.id) {
      this.blogsService
        .deleteBlog(this.blog.id)
        .then(() => {
          this.snackbarService.open('Blog deleted successfully', 'Ok', {
            duration: 2 * 1000,
          });
          this.router.navigate(['/']);
        })
        .catch((error) => {
          console.log(error);
          this.snackbarService.open('Blog deletion failed', 'Ok', {
            duration: 2 * 1000,
          });
        });
    }
  }

  publishBlog(): void {
    if (this.blog?.id) {
      this.blogsService
        .publishBlog(this.blog.id)
        .then(() => {
          this.snackbarService.open('Blog published successfully', 'Ok', {
            duration: 2 * 1000,
          });
        })
        .catch((error) => {
          console.log(error);
          this.snackbarService.open('Blog publishing failed', 'Ok', {
            duration: 2 * 1000,
          });
        });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
