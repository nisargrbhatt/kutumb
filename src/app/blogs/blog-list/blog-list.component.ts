import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { Blog } from 'src/app/interfaces/blog';
import { User } from 'src/app/interfaces/user';
import { SubSink } from 'subsink';
import { BlogsService } from '../blogs.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  blogs: Blog[] = [];

  user: User | any;

  constructor(
    private blogsService: BlogsService,
    private snackbarService: MatSnackBar,
    private router: Router,
    private auth: AuthService
  ) {
    this.subs.sink = this.blogsService.getBlogs().subscribe((blogs) => {
      this.blogs = blogs;
    });

    this.subs.sink = this.auth.user.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
