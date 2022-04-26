import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/auth.service';
import { Event } from 'src/app/interfaces/event';
import { User } from 'src/app/interfaces/user';
import { SubSink } from 'subsink';
import { EventService } from '../event.service';
import { RsvpDialogComponent } from '../rsvp-dialog/rsvp-dialog.component';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  user: User | any;

  constructor(
    public eventService: EventService,
    private auth: AuthService,
    private dialogService: MatDialog,
    private snackbarService: MatSnackBar
  ) {
    this.subs.sink = this.auth.user.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit(): void {}

  checkUpcoming(date: Date | string): boolean {
    const now = new Date();
    const incomingDate = new Date(date);
    return incomingDate > now;
  }

  checkUserResponed(event: Event): boolean {
    if (!event?.user_response || event?.user_response.length === 0) {
      return false;
    }
    const index = event?.user_response.findIndex((response) => {
      return response.userId === this.user?.uid;
    });

    return index > -1 ? true : false;
  }

  addRSVP(event: Event): void {
    this.dialogService.open(RsvpDialogComponent, {
      data: {
        name: this.user.displayName,
        eventName: event.name,
        userId: this.user.uid,
        eventId: event.id,
      },
      autoFocus: true,
      hasBackdrop: true,
    });
  }

  cancelRSVP(event: Event): void {
    if (
      !event?.user_response ||
      event?.user_response.length === 0 ||
      !event.id
    ) {
      return;
    }
    const index = event?.user_response.findIndex((response) => {
      return response.userId === this.user?.uid;
    });
    if (index > -1) {
      this.eventService
        .deleteResponse(event.user_response[index], event.id)
        .then(() => {
          this.snackbarService.open('RSVP canceled successfully', 'Ok', {
            duration: 2 * 1000,
          });
        })
        .catch((error) => {
          console.log(error);
          this.snackbarService.open('RSVP cancelation failed', 'Ok', {
            duration: 2 * 1000,
          });
        });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
