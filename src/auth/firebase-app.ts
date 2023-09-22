import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as firebase from 'firebase-admin';

@Injectable()
export class FirebaseApp {
  private firebaseApp: firebase.app.App;
  private firebaseConfig: any;

  constructor(private readonly configService: ConfigService) {
    this.firebaseConfig = {
      clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
      projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
      privateKey: this.configService.get<string>('FIREBASE_PRIVATE_KEY'),
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
