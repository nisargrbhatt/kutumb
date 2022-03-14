import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from '../event.service';

interface DialogData {
  name: string;
  eventName: string;
  userId: string;
  eventId: string;
}

@Component({
  selector: 'app-rsvp-dialog',
  templateUrl: './rsvp-dialog.component.html',
  styleUrls: ['./rsvp-dialog.component.scss'],
})
export class RsvpDialogComponent implements OnInit {
  responseForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<RsvpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private eventService: EventService,
    private snackbarService: MatSnackBar
  ) {
    this.responseForm = new FormGroup({
      count: new FormControl('', {
        validators: [Validators.required, Validators.min(0)],
      }),
    });
  }

  ngOnInit(): void {}

  onResponseFormSubmit(): void {
    if (this.responseForm.invalid) {
      return;
    }

    this.eventService
      .addResponse(
        {
          count: this.responseForm.value.count,
          name: this.data.name,
          userId: this.data.userId,
        },
        this.data.eventId
      )
      .then(() => {
        this.snackbarService.open(
          `RSVP added to ${this.data.eventName}`,
          'Ok',
          {
            duration: 2 * 1000,
          }
        );
        this.dialogRef.close(true);
      })
      .catch((error) => {
        console.log(error);
        this.snackbarService.open(`RSVP process failed`, 'Ok', {
          duration: 2 * 1000,
        });
        this.dialogRef.close(true);
      });
  }
}
