import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/auth.service';
import { MemoryComment } from 'src/app/interfaces/memory';
import { User } from 'src/app/interfaces/user';
import { SubSink } from 'subsink';
import { MemoriesService } from '../memories.service';
import { PaginationService } from '../pagination.service';

@Component({
  selector: 'app-memories-show',
  templateUrl: './memories-show.component.html',
  styleUrls: ['./memories-show.component.scss'],
})
export class MemoriesShowComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  user: User | any;

  memories: any[] = [];

  commentFormControl = new FormControl('');

  constructor(
    public page: PaginationService,
    private memoriesService: MemoriesService,
    private auth: AuthService,
    private snackbarService: MatSnackBar
  ) {
    this.subs.sink = this.auth.user.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    this.page.init('memories', 'createdAt', { reverse: true, prepend: false });
    this.subs.sink = this.page.data?.subscribe((memories) => {
      this.memories = memories;
    });
  }

  scrollHandler(e: any) {
    if (e === 'bottom') {
      this.page.more();
    }
  }

  addLike(memoryId: string): void {
    this.memoriesService.addLikes(this.user.uid, memoryId).catch((error) => {
      console.log(error);
    });
  }

  removeLike(memoryId: string): void {
    this.memoriesService.deleteLikes(this.user.uid, memoryId).catch((error) => {
      console.log(error);
    });
  }

  checkLike(likes: string[]): boolean {
    return !likes.includes(this.user.uid);
  }

  addComment(memoryId: string): void {
    if (this.commentFormControl.value.trim().length < 1) {
      return;
    }
    this.memoriesService
      .addMemoryComment(
        {
          message: this.commentFormControl.value.trim(),
          createdAt: new Date().toJSON(),
          userId: this.user.uid,
        },
        memoryId || 'any'
      )
      .then(() => {
        this.commentFormControl.reset();
        this.snackbarService.open('Comment added successfully', 'Ok', {
          duration: 2 * 1000,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  removeComment(comment: MemoryComment, id?: string): void {
    this.memoriesService
      .deleteMemoryComment(comment, id || 'any')
      .then(() => {
        this.snackbarService.open('Comment deleted successfully', 'Ok', {
          duration: 2 * 1000,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  deleteMemory(id: string): void {
    this.memoriesService
      .deleteMemory(id)
      .then(() => {
        this.snackbarService.open('Memory deleted successfully', 'Ok', {
          duration: 2 * 1000,
        });
        this.ngOnInit();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
