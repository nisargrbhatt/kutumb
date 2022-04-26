import { Injectable } from '@angular/core';

import {
  collection,
  Firestore,
  limit,
  orderBy,
  Query,
  query,
  startAfter,
  collectionSnapshots,
} from '@angular/fire/firestore';
import {
  BehaviorSubject,
  Observable,
  scan,
  Subscription,
  take,
  tap,
} from 'rxjs';

interface QueryConfig {
  path: string;
  field: string;
  limit: number;
  reverse: boolean;
  prepend: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject<any[]>([]);

  private query: QueryConfig;

  data: Observable<any> | undefined;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();

  constructor(private afs: Firestore) {
    this.query = {
      path: 'memories',
      field: 'date',
      limit: 2,
      reverse: false,
      prepend: false,
    };
  }

  init(path: string, field: string, opts?: any): void {
    this.query = {
      path,
      field,
      limit: 2,
      reverse: false,
      prepend: false,
      ...opts,
    };

    const collectionRef = collection(this.afs, this.query.path);
    const first = query(
      collectionRef,
      orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc'),
      limit(this.query.limit)
    );

    this.mapAndUpdate(first);

    this.data = this._data.asObservable().pipe(
      scan((acc, val) => {
        return this.query.prepend ? val.concat(acc) : acc.concat(val);
      })
    );
  }

  more(): void {
    const cursor = this.getCursor();

    const collectionRef = collection(this.afs, this.query.path);
    const more = query(
      collectionRef,
      orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc'),
      limit(this.query.limit),
      startAfter(cursor)
    );

    this.mapAndUpdate(more);
  }

  private getCursor(): any {
    const current = this._data.value;

    if (current.length) {
      return this.query.prepend
        ? current[0].doc
        : current[current.length - 1].doc;
    }
    return null;
  }

  private mapAndUpdate(queryRef: Query<any>): Subscription | undefined {
    if (this._done.value || this._loading.value) {
      return;
    }

    this._loading.next(true);

    return collectionSnapshots(queryRef)
      .pipe(
        tap((arr) => {
          let values = arr.map((snap) => {
            const data = snap.data();
            const doc = snap;

            return {
              ...data,
              doc,
            };
          });

          values = this.query.prepend ? values.reverse() : values;

          this._data.next(values);
          this._loading.next(false);

          if (!values.length) {
            this._done.next(true);
          }
        }),
        take(1)
      )
      .subscribe();
  }
}
