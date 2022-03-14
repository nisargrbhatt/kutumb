import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  doc,
  docData,
  Firestore,
  DocumentReference,
  setDoc,
} from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { AuthService } from '../core/auth.service';
import { User } from '../interfaces/user';

interface DialogData {
  userId: string;
}

@Component({
  selector: 'app-user-lookup',
  templateUrl: './user-lookup.component.html',
  styleUrls: ['./user-lookup.component.scss'],
})
export class UserLookupComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  user: User | undefined;

  lookupUser: User | undefined;
  lookupUserRef: DocumentReference;

  roleForm: FormGroup;
  editModeRole = false;

  constructor(
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) private dialogData: DialogData,
    private dialogRef: MatDialogRef<UserLookupComponent>,
    private afs: Firestore,
    private snackBarService: MatSnackBar
  ) {
    this.roleForm = new FormGroup({
      member: new FormControl(
        { value: '', disabled: true },
        {
          validators: [Validators.requiredTrue],
        }
      ),
      special: new FormControl(
        { value: '', disabled: true },
        {
          validators: [],
        }
      ),
      admin: new FormControl(
        { value: '', disabled: true },
        {
          validators: [],
        }
      ),
    });

    this.auth.user.subscribe((user) => {
      this.user = user;
    });
    this.lookupUserRef = doc(this.afs, `users/${this.dialogData.userId}`);
    docData<User | any>(this.lookupUserRef).subscribe((user) => {
      this.lookupUser = user;

      this.roleForm.patchValue({
        member: user.roles?.member,
        special: user.roles?.special,
        admin: user.roles?.admin,
      });
    });
  }

  ngOnInit(): void {}

  toggleEditRole(): void {
    this.editModeRole = !this.editModeRole;
    if (this.editModeRole) {
      this.roleForm.get('member')?.enable();
      this.roleForm.get('special')?.enable();
      this.roleForm.get('admin')?.enable();
    } else {
      this.roleForm.get('member')?.disable();
      this.roleForm.get('special')?.disable();
      this.roleForm.get('admin')?.disable();
    }
  }

  onRoleSubmit(): void {
    if (this.roleForm.invalid) {
      return;
    }

    if (!this.roleForm.dirty) {
      return;
    }

    this.toggleEditRole();

    setDoc(
      this.lookupUserRef,
      {
        roles: {
          member: this.roleForm.value.member,
          special: this.roleForm.value.special,
          admin: this.roleForm.value.admin,
        },
      },
      {
        merge: true,
      }
    )
      .then(() => {
        this.snackBarService.open('Roles updated Successfully', 'Ok', {
          duration: 2 * 1000,
        });
      })
      .catch((error) => {
        console.log(error);
        this.snackBarService.open('Role updation failed', 'Ok', {
          duration: 2 * 1000,
        });
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
