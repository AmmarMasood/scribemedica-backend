import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';

@Injectable()
export class FirebaseApp {
  private firebaseApp: firebase.app.App;
  private firebaseConfig: any;

  constructor() {
    this.firebaseConfig = {
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY
            .replace(/\\n/g, '\n')
        : undefined,
    };

    this.firebaseApp = firebase.initializeApp({
      credential: firebase.credential.cert({ ...this.firebaseConfig }),
    });
  }

  getAuth = (): firebase.auth.Auth => {
    return this.firebaseApp.auth();
  };

  firestore = (): firebase.firestore.Firestore => {
    return this.firebaseApp.firestore();
  };
}
