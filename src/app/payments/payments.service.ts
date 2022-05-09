import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  DocumentReference,
  Firestore,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Payment } from '../interfaces/payment';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  payments$: Observable<Payment[]>;
  paymentsCollectionRef: CollectionReference<Payment | any>;

  constructor(private afs: Firestore) {
    this.paymentsCollectionRef = collection(this.afs, 'payments');
    this.payments$ = collectionData<Payment | any>(this.paymentsCollectionRef, {
      idField: 'id',
    });
  }

  addPayment(payment: Payment): Promise<DocumentReference<Payment>> {
    return addDoc<Payment>(this.paymentsCollectionRef, payment);
  }

  updatePayment(paymentData: any, id: string): Promise<void> {
    return setDoc<Payment | any>(doc(this.afs, `payments/${id}`), paymentData, {
      merge: true,
    });
  }

  toggleActivePayment(active: boolean, id: string): Promise<void> {
    return setDoc<Payment | any>(
      doc(this.afs, `payments/${id}`),
      {
        active,
      },
      {
        merge: true,
      }
    );
  }

  deletePayment(id: string): Promise<void> {
    return deleteDoc(doc(this.afs, `payments/${id}`));
  }

  getPayments(): Observable<Payment[]> {
    const paymentQuery = query(
      this.paymentsCollectionRef,
      where('active', '==', true)
    );

    return collectionData<Payment>(paymentQuery, {
      idField: 'id',
    });
  }

  getPayment(id: string): Observable<Payment> {
    return docData<Payment | any>(doc(this.afs, `payments/${id}`), {
      idField: 'id',
    });
  }
}
