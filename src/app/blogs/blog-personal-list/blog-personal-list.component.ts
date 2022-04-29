import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { AuthService } from 'src/app/core/auth.service';
import { Blog } from 'src/app/interfaces/blog';
import { SubSink } from 'subsink';
import { BlogsService } from '../blogs.service';

@Component({
  selector: 'app-blog-personal-list',
  templateUrl: './blog-personal-list.component.html',
  styleUrls: ['./blog-personal-list.component.scss'],
})
export class BlogPersonalListComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  blogs: Blog[] = [];

  user: User | any;
  constructor(
    private blogsService: BlogsService,
    private snackbarService: MatSnackBar,
    private router: Router,
    private auth: AuthService
  ) {
    this.subs.sink = this.auth.user.subscribe((user) => {
      this.user = user;
      this.subs.sink = this.blogsService
        .getUsersBlog(user.uid)
        .subscribe((blogs) => {
          this.blogs = blogs;
        });
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
