import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(Auth);
  firestore = inject(Firestore);

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<void> {
    try {
      const userData = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      const uid = this.auth.currentUser?.uid;
      const userDocRef = doc(this.firestore, `users/${uid}`);
      setDoc(userDocRef, { uid, username, email, password });

      console.log('New account created! ' + userData.user.email);
    } catch (error) {
      console.warn('Registration failed! Something went wrong!');
      throw error;
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const userData = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      console.log('Welcome! You signed In! ' + userData.user.email);
    } catch (error) {
      console.warn('Something went wrong when you tried to sign in!');
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('You signed out!');
    } catch {
      console.warn('Something went wrong when you tried to sign out!');
    }
  }
}
