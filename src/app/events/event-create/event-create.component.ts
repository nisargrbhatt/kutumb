import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubSink } from 'subsink';
import { take } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss'],
})
export class EventCreateComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  eventForm: FormGroup;

  editMode = false;
  eventId: string | any;

  user: User | any;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private auth: AuthService,
    private snackbarService: MatSnackBar,
    private router: Router,
    private datepipe: DatePipe
  ) {
    this.eventForm = new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required],
      }),
      location: new FormControl('', {
        validators: [Validators.required],
      }),
      description: new FormControl('', {
        validators: [Validators.required],
      }),
      date: new FormControl('', {
        validators: [Validators.required],
      }),
      time: new FormControl('', {
        validators: [Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    this.auth.user.subscribe((user) => {
      this.user = user;
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.editMode = true;
        this.eventId = paramMap.get('id');
        this.getEventData();
      } else {
        this.editMode = false;
      }
    });
  }

  getEventData(): void {
    this.subs.sink = this.eventService
      .getEvent(this.eventId)
      .pipe(take(1))
      .subscribe((event) => {
        this.eventForm.patchValue({
          name: event?.name,
          location: event?.location,
          description: event?.description,
          date: this.datepipe.transform(new Date(event?.date), 'yyyy-MM-dd'),
          time: event?.time,
        });
      });
  }

  onEventFormSubmit(): void {
    if (this.eventForm.invalid) {
      return;
    }
    if (this.editMode) {
      if (!this.eventForm.dirty) {
        return;
      }
      this.eventService
        .updateEvent(
          {
            name: this.eventForm.value?.name,
            location: this.eventForm.value?.location,
            description: this.eventForm.value?.description,
            date: new Date(this.eventForm.value?.date).toJSON(),
            time: this.eventForm.value?.time,
          },
          this.eventId
        )
        .then(() => {
          this.snackbarService.open('Event updated successfully', 'Ok', {
            duration: 2 * 1000,
          });
          this.router.navigate(['event']);
        })
        .catch((error) => {
          console.log(error);
          this.snackbarService.open('Event updation failed', 'Ok', {
            duration: 2 * 1000,
          });
        });
    } else {
      this.eventService
        .addEvent({
          name: this.eventForm.value?.name,
          location: this.eventForm.value?.location,
          description: this.eventForm.value?.description,
          date: new Date(this.eventForm.value?.date).toJSON(),
          time: this.eventForm.value?.time,
          createdAt: new Date().toJSON(),
          createdBy: this.user?.uid,
          user_response: [],
        })
        .then(() => {
          this.snackbarService.open('Event created sucessfully', 'Ok', {
            duration: 2 * 1000,
          });
          this.router.navigate(['event']);
        })
        .catch((error) => {
          console.log(error);
          this.snackbarService.open('Event creation failed', 'Ok', {
            duration: 2 * 1000,
          });
        });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
