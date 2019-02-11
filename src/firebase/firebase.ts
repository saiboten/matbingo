import { default as firebaseApp } from "firebase";

const config = {
  apiKey: "AIzaSyBmoWBsrp_L7fqrMR29OgooExzPxwbojLw",
  authDomain: "food-eureka.firebaseapp.com",
  databaseURL: "https://food-eureka.firebaseio.com",
  projectId: "food-eureka",
  storageBucket: "food-eureka.appspot.com",
  messagingSenderId: "779242213869"
};

export const firebase = firebaseApp.initializeApp(config);
