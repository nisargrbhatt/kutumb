import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { filter, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { Event } from 'src/app/interfaces/event';
import { User } from 'src/app/interfaces/user';
import { SubSink } from 'subsink';
import { EventService } from '../event.service';

@Component({
  selector: 'app-event-show',
  templateUrl: './event-show.component.html',
  styleUrls: ['./event-show.component.scss'],
})
export class EventShowComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  user: User | any;

  event: Event | undefined;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private auth: AuthService,
    private snackbarService: MatSnackBar
  ) {
    this.subs.sink = this.auth.user.subscribe((user) => {
      this.user = user;
    });
    this.subs.sink = this.route.paramMap
      .pipe(
        filter((paramMap: ParamMap) => paramMap.has('id')),
        switchMap((paramMap: ParamMap) =>
          this.eventService.getEvent(paramMap.get('id'))
        )
      )
      .subscribe((event) => {
        this.event = event;
      });
  }

  ngOnInit(): void {}

  deleteEvent(): void {
    if (this.event?.id) {
      this.eventService
        .deleteEvent(this.event.id)
        .then(() => {
          this.snackbarService.open(
            `${this.event?.name} deleted successfully`,
            'Ok',
            {
              duration: 2 * 1000,
            }
          );
        })
        .catch((error) => {
          console.log(error);
          this.snackbarService.open('Event deletion failed', 'Ok', {
            duration: 2 * 1000,
          });
        });
    }
  }

  checkCreated(date: Date | string): boolean {
    return new Date() > new Date(date);
  }

  countUserResponse(): number {
    return (
      this.event?.user_response?.reduce((acc, val) => acc + val.count, 0) || 0
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
