import * as firebase from 'firebase-admin';
export declare class FirebaseApp {
    private firebaseApp;
    private firebaseConfig;
    constructor();
    getAuth: () => firebase.auth.Auth;
    firestore: () => firebase.firestore.Firestore;
}
