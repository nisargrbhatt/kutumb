import { AuthService } from 'src/app/core/auth.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { finalize, map, Observable, of } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MemoriesService } from '../memories.service';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { User } from 'src/app/interfaces/user';
import {
  Storage,
  ref,
  percentage,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';

@Component({
  selector: 'app-memories-create',
  templateUrl: './memories-create.component.html',
  styleUrls: ['./memories-create.component.scss'],
})
export class MemoriesCreateComponent implements OnDestroy {
  private subs = new SubSink();

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  user: User | any;

  photos: string[] = [];

  uploadPercentage: Observable<number> = of(0);
  uploadStarted = false;

  description = new FormControl('', {
    validators: [Validators.required],
  });

  tags = new Set<string>([]);

  constructor(
    private memoriesService: MemoriesService,
    private auth: AuthService,
    private router: Router,
    private snackbarService: MatSnackBar,
    private cookieService: CookieService,
    private aStorage: Storage
  ) {
    this.subs.sink = this.auth.user.subscribe((user) => {
      this.user = user;
    });

    if (this.cookieService.check('MEMORIES_COOKIE')) {
      this.checkAndRetrieve();
    }
  }

  onMemoryFormSubmit(): void {
    if (this.description.invalid) {
      return;
    }

    if (this.photos.length < 1) {
      return;
    }
    this.cookieService.delete('MEMORIES_COOKIE');
    this.memoriesService
      .addMemory({
        createdAt: new Date().toJSON(),
        createdBy: this.user?.uid,
        description: this.description.value,
        tags: Array.from(this.tags),
        photos: this.photos,
        comments: [],
        likes: [],
      })
      .then(() => {
        this.snackbarService.open('Memory created successfully', 'Ok', {
          duration: 2 * 1000,
        });
        this.router.navigate(['/memories']);
      })
      .catch((error) => {
        console.log(error);
        this.snackbarService.open('Memory creation failed', 'Ok', {
          duration: 2 * 1000,
        });
      });
  }

  private checkAndRetrieve(): void {
    const cookieJSON = this.cookieService.get('MEMORIES_COOKIE');
    let cookieParsed;
    try {
      cookieParsed = JSON.parse(cookieJSON);
    } catch (error) {
      console.log(error);
      return;
    }

    if (Array.isArray(cookieParsed)) {
      cookieParsed.forEach((cookie: string) => {
        if (
          cookie.match(
            `https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)`
          )
        ) {
          this.photos.push(cookie);
        }
      });
    } else {
      this.cookieService.delete('MEMORIES_COOKIE');
      console.log('Cookie Manipulation');
      return;
    }
  }

  uploadPhoto(event: any): void {
    this.uploadStarted = true;
    const file = event.target.files[0];
    const filePath = `memories/${Date.now() + '-' + file.name}`;
    const fileRef = ref(this.aStorage, filePath);
    const task = uploadBytesResumable(fileRef, file);
    this.uploadPercentage = percentage(task).pipe(
      map((val) => val.progress),
      finalize(() => {
        this.uploadStarted = false;
        getDownloadURL(fileRef).then((url) => {
          this.photos.push(url);
          this.cookieService.delete('MEMORIES_COOKIE');
          this.cookieService.set(
            'MEMORIES_COOKIE',
            JSON.stringify(this.photos)
          );
        });
      })
    );
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
