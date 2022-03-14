import { Injectable } from '@angular/core';
import {
  CollectionReference,
  collection,
  Firestore,
  query,
  orderBy,
  collectionData,
  addDoc,
  DocumentReference,
  setDoc,
  doc,
  deleteDoc,
  docData,
  arrayUnion,
  arrayRemove,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Event, UserResponse } from 'src/app/interfaces/event';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  eventsCollectionRef: CollectionReference<Event | any>;
  events$: Observable<Event[]>;

  constructor(private afs: Firestore) {
    this.eventsCollectionRef = collection(this.afs, `events`);
    const q = query(this.eventsCollectionRef, orderBy('createdAt', 'desc'));
    this.events$ = collectionData<Event>(q, {
      idField: 'id',
    });
  }

  addEvent(event: Event): Promise<DocumentReference<Event>> {
    return addDoc<Event>(this.eventsCollectionRef, event);
  }

  updateEvent(eventUpdateData: any, id: string): Promise<void> {
    return setDoc<any>(doc(this.afs, `events/${id}`), eventUpdateData, {
      merge: true,
    });
  }

  deleteEvent(id: string): Promise<void> {
    return deleteDoc(doc(this.afs, `events/${id}`));
  }

  getEvent(id: string | null): Observable<Event> {
    return docData<Event | any>(doc(this.afs, `events/${id}`), {
      idField: 'id',
    });
  }

  addResponse(user_response: UserResponse, id: string): Promise<any> {
    return updateDoc<Event | any>(doc(this.afs, `events/${id}`), {
      user_response: arrayUnion(user_response),
    });
  }

  deleteResponse(user_response: UserResponse, id: string): Promise<any> {
    return updateDoc<Event | any>(doc(this.afs, `events/${id}`), {
      user_response: arrayRemove(user_response),
    });
  }
}
