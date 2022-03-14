import { Component, OnInit } from '@angular/core';
import {
  Storage,
  ref,
  percentage,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';
import {
  Firestore,
  CollectionReference,
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  doc,
} from '@angular/fire/firestore';
import { AppBanner } from 'src/app/interfaces/app-banner';
import { finalize, map, Observable, of } from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-setting-banner',
  templateUrl: './setting-banner.component.html',
  styleUrls: ['./setting-banner.component.scss'],
})
export class SettingBannerComponent implements OnInit {
  appBannerCollectionRef: CollectionReference<AppBanner | any>;
  appBannerData$: Observable<AppBanner[]>;

  bannerForm: FormGroup;

  uploadPercentage: Observable<number> = of(0);
  uploadStarted = false;

  mybreakpoint: number = 2;

  constructor(
    private aStorage: Storage,
    private afs: Firestore,
    private snackbarService: MatSnackBar
  ) {
    this.appBannerCollectionRef = collection(this.afs, `app_banner`);
    this.appBannerData$ = collectionData<AppBanner>(
      this.appBannerCollectionRef,
      {
        idField: 'id',
      }
    );
    this.bannerForm = new FormGroup({
      title: new FormControl('', {
        validators: [Validators.required],
      }),
      subTitle: new FormControl('', {
        validators: [Validators.required],
      }),
      bannerImageURL: new FormControl('', {
        validators: [Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    this.mybreakpoint = window.innerWidth <= 1000 ? 2 : 4;
    if (window.innerWidth <= 532) {
      this.mybreakpoint = 1;
    }
  }

  handleSize(event: any): void {
    this.mybreakpoint = event.target.innerWidth <= 1000 ? 2 : 4;
    if (event.target.innerWidth <= 532) {
      this.mybreakpoint = 1;
    }
  }

  updatePhoto(event: any): void {
    this.uploadStarted = true;
    const file = event.target.files[0];
    const filePath = `app_banner/${file.name + '-' + Date.now()}`;
    const fileRef = ref(this.aStorage, filePath);
    const task = uploadBytesResumable(fileRef, file);
    this.uploadPercentage = percentage(task).pipe(
      map((val) => val.progress),
      finalize(() => {
        this.uploadStarted = false;
        getDownloadURL(fileRef).then((url) => {
          this.bannerForm.get('bannerImageURL')?.patchValue(url);
        });
      })
    );
  }

  onBannerFormSubmit(formDirective: FormGroupDirective): void {
    if (this.bannerForm.invalid) {
      return;
    }

    addDoc(this.appBannerCollectionRef, {
      title: this.bannerForm.value.title,
      subTitle: this.bannerForm.value.subTitle,
      bannerImageURL: this.bannerForm.value.bannerImageURL,
      createdAt: new Date().toJSON(),
    })
      .then(() => {
        this.snackbarService.open('Banner added successfully', 'Ok', {
          duration: 2 * 1000,
        });
        formDirective.resetForm();
        this.bannerForm.reset();
      })
      .catch((error) => {
        console.log(error);
        this.snackbarService.open('Banner creaion failed', 'Ok', {
          duration: 2 * 1000,
        });
      });
  }

  deleteBanner(banner: AppBanner) {
    deleteDoc(doc(this.afs, `app_banner/${banner?.id}`))
      .then(() => {
        this.snackbarService.open('Banner deleted successfully', 'Ok', {
          duration: 2 * 1000,
        });
      })
      .catch((error) => {
        console.log(error);
        this.snackbarService.open('Banner deletion failed', 'Ok', {
          duration: 2 * 1000,
        });
      });
  }
}
