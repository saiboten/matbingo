// This import loads the firebase namespace along with all its type information.
import * as firebaseApp from "firebase/app";

// These imports load individual services into the firebase namespace.
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

export const googleAuthProvider = new firebaseApp.auth.GoogleAuthProvider();
export const facebookAuthProvider = new firebaseApp.auth.FacebookAuthProvider();

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
};

export const firebase = firebaseApp.initializeApp(config);
