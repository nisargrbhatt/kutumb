import { AuthService } from 'src/app/core/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentReference, setDoc } from '@angular/fire/firestore';
import { finalize, map, Observable, of } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Roles, User } from 'src/app/interfaces/user';
import { SubSink } from 'subsink';

import {
  Storage,
  ref,
  percentage,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  profileForm: FormGroup;
  roleForm: FormGroup;

  uploadPercentage: Observable<number> = of(0);
  uploadStarted = false;

  editModeProfile = false;
  editModeRole = false;

  userRef: DocumentReference<User | any>;
  photoURL: string | any;
  roles: Roles | any;

  user: User | any;

  constructor(
    public auth: AuthService,
    private aStorage: Storage,
    private snackBarService: MatSnackBar
  ) {
    this.profileForm = new FormGroup({
      displayName: new FormControl(
        { value: '', disabled: true },
        {
          validators: [Validators.required],
        }
      ),
      contactNo: new FormControl(
        { value: '', disabled: true },
        {
          validators: [Validators.minLength(10), Validators.maxLength(10)],
        }
      ),
      fullName: new FormControl(
        { value: '', disabled: true },
        {
          validators: [],
        }
      ),
      fatherName: new FormControl(
        { value: '', disabled: true },
        {
          validators: [],
        }
      ),
      motherName: new FormControl(
        { value: '', disabled: true },
        {
          validators: [],
        }
      ),
      nativePlace: new FormControl(
        { value: '', disabled: true },
        {
          validators: [],
        }
      ),
      homeAddress: new FormControl(
        { value: '', disabled: true },
        {
          validators: [],
        }
      ),
    });
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
    this.userRef = this.auth.userRef;
  }

  ngOnInit(): void {
    this.subs.sink = this.auth.user.subscribe((user) => {
      this.user = user;
      this.photoURL = user?.photoURL;
      this.roles = user?.roles;
      this.profileForm.patchValue({
        displayName: user?.displayName,
        contactNo: user?.contactNo,
        fullName: user?.fullName,
        fatherName: user?.fatherName,
        motherName: user?.motherName,
        nativePlace: user?.nativePlace,
        homeAddress: user?.homeAddress,
      });

      this.roleForm.patchValue({
        member: user.roles?.member,
        special: user.roles?.special,
        admin: user.roles?.admin,
      });
    });
  }

  updatePhoto(event: any): void {
    this.uploadStarted = true;
    const file = event.target.files[0];
    const filePath = `users/${file.name + Date.now()}`;
    const fileRef = ref(this.aStorage, filePath);
    const task = uploadBytesResumable(fileRef, file);
    this.uploadPercentage = percentage(task).pipe(
      map((val) => val.progress),
      finalize(() => {
        this.uploadStarted = false;
        getDownloadURL(fileRef).then((url) => {
          setDoc(
            this.userRef,
            {
              photoURL: url,
            },
            { merge: true }
          );
        });
      })
    );
  }

  toggleEditProfile(): void {
    this.editModeProfile = !this.editModeProfile;
    if (this.editModeProfile) {
      this.profileForm.get('displayName')?.enable();
      this.profileForm.get('contactNo')?.enable();
      this.profileForm.get('fullName')?.enable();
      this.profileForm.get('fatherName')?.enable();
      this.profileForm.get('motherName')?.enable();
      this.profileForm.get('nativePlace')?.enable();
      this.profileForm.get('homeAddress')?.enable();
    } else {
      this.profileForm.get('displayName')?.disable();
      this.profileForm.get('contactNo')?.disable();
      this.profileForm.get('fullName')?.disable();
      this.profileForm.get('fatherName')?.disable();
      this.profileForm.get('motherName')?.disable();
      this.profileForm.get('nativePlace')?.disable();
      this.profileForm.get('homeAddress')?.disable();
    }
  }

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

  onProfileSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    if (!this.profileForm.dirty) {
      return;
    }

    this.toggleEditProfile();
    setDoc(
      this.userRef,
      {
        displayName: this.profileForm.value.displayName,
        contactNo: this.profileForm.value.contactNo,
        fullName: this.profileForm.value.fullName,
        fatherName: this.profileForm.value.fatherName,
        motherName: this.profileForm.value.motherName,
        nativePlace: this.profileForm.value.nativePlace,
        homeAddress: this.profileForm.value.homeAddress,
      },
      { merge: true }
    )
      .then(() => {
        this.snackBarService.open('Profile updated Successfully', 'Ok', {
          duration: 2 * 1000,
        });
      })
      .catch((error) => {
        console.log(error);
        this.snackBarService.open('Profiel updation failed', 'Ok', {
          duration: 2 * 1000,
        });
      });
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
      this.userRef,
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
