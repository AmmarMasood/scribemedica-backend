import { ConfigService } from '@nestjs/config';
import * as firebase from 'firebase-admin';
export declare class FirebaseApp {
    private readonly configService;
    private firebaseApp;
    private firebaseConfig;
    constructor(configService: ConfigService);
    getAuth: () => firebase.auth.Auth;
    firestore: () => firebase.firestore.Firestore;
}
