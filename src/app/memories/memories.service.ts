import { Injectable } from '@angular/core';
import { startAfter } from '@angular/fire/database';
import {
  Firestore,
  CollectionReference,
  collection,
  collectionData,
  addDoc,
  DocumentReference,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  limit,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Memory, MemoryComment } from '../interfaces/memory';

@Injectable({
  providedIn: 'root',
})
export class MemoriesService {
  memories$: Observable<Memory[]>;
  memoriesCollectionRef: CollectionReference<Memory | any>;

  scrollMemories$: Subject<Memory[]> = new Subject<Memory[]>();
  scrollLength: BehaviorSubject<number> = new BehaviorSubject<number>(3);

  constructor(private afs: Firestore) {
    this.memoriesCollectionRef = collection(this.afs, `memories`);
    this.memories$ = collectionData<Memory | any>(this.memoriesCollectionRef, {
      idField: 'id',
    });
  }

  addMemory(memory: Memory): Promise<DocumentReference<Memory>> {
    return addDoc<Memory>(this.memoriesCollectionRef, memory);
  }

  deleteMemory(id: string): Promise<void> {
    return deleteDoc(doc(this.afs, `memories/${id}`));
  }

  addMemoryComment(comment: MemoryComment, id: string): Promise<any> {
    return updateDoc(doc(this.afs, `memories/${id}`), {
      comments: arrayUnion(comment),
    });
  }

  deleteMemoryComment(comment: MemoryComment, id: string): Promise<any> {
    return updateDoc(doc(this.afs, `memories/${id}`), {
      comments: arrayRemove(comment),
    });
  }

  addLikes(userId: string, id: string): Promise<any> {
    return updateDoc(doc(this.afs, `memories/${id}`), {
      likes: arrayUnion(userId),
    });
  }

  deleteLikes(userId: string, id: string): Promise<any> {
    return updateDoc(doc(this.afs, `memories/${id}`), {
      likes: arrayRemove(userId),
    });
  }

  getMemories() {
    const memoryQuery = query(
      this.memoriesCollectionRef,
      limit(this.scrollLength.getValue())
    );
  }
}
