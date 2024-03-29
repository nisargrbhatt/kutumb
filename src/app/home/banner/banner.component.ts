import { Component } from '@angular/core';

import {
  Firestore,
  CollectionReference,
  collection,
  collectionData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AppBanner } from 'src/app/interfaces/app-banner';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  appBannerCollectionRef: CollectionReference<AppBanner | any>;
  appBannerData$: Observable<AppBanner[]>;
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    pauseOnHover: true,
  };

  constructor(private afs: Firestore) {
    this.appBannerCollectionRef = collection(this.afs, `app_banner`);
    this.appBannerData$ = collectionData<AppBanner>(
      this.appBannerCollectionRef,
      {
        idField: 'id',
      }
    );
  }
}
