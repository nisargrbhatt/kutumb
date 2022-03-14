import { Injectable } from '@angular/core';

import {
  Auth,
  authState,
  GoogleAuthProvider,
  signInWithPopup,
  User as AuthUser,
  signOut,
} from '@angular/fire/auth';
import {
  doc,
  Firestore,
  DocumentReference,
  docData,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, switchMap, of, shareReplay } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: Observable<User | any>;
  userRef: DocumentReference<User | any> | any;

  constructor(private afAuth: Auth, private afs: Firestore) {
    this.user = authState(afAuth).pipe(
      switchMap((user) => {
        if (user) {
          this.userRef = doc(this.afs, `users/${user.uid}`);
          return docData(doc(this.afs, `users/${user.uid}`));
        } else {
          return of(null);
        }
      }),
      shareReplay()
    );
  }

  googleLogin(): Promise<void> {
    const provider = new GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider: GoogleAuthProvider): Promise<void> {
    return signInWithPopup(this.afAuth, provider).then((credential) => {
      this.updateUserData(credential.user);
    });
  }

  private updateUserData(user: AuthUser | any): Promise<void> {
    const userRef: DocumentReference = doc(this.afs, `users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      roles: {
        member: true,
      },
    };

    return setDoc(userRef, data, { merge: true });
  }

  logout(): void {
    signOut(this.afAuth);
  }
}
