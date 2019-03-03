// This import loads the firebase namespace along with all its type information.
import * as firebaseApp from "firebase/app";

// These imports load individual services into the firebase namespace.
import "firebase/auth";
import "firebase/firestore";

export const googleAuthProvider = new firebaseApp.auth.GoogleAuthProvider();

const config = {
  apiKey: "AIzaSyBmoWBsrp_L7fqrMR29OgooExzPxwbojLw",
  authDomain: "food-eureka.firebaseapp.com",
  databaseURL: "https://food-eureka.firebaseio.com",
  projectId: "food-eureka",
  storageBucket: "food-eureka.appspot.com",
  messagingSenderId: "779242213869"
};

export const firebase = firebaseApp.initializeApp(config);
