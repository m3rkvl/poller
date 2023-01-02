// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4hIQD6T0y3kY6tYsaV4izAIDdCyCVXhw",
  authDomain: "poller-m3rkvl.firebaseapp.com",
  databaseURL:
    "https://poller-m3rkvl-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "poller-m3rkvl",
  storageBucket: "poller-m3rkvl.appspot.com",
  messagingSenderId: "759223342520",
  appId: "1:759223342520:web:ff755497aa62864998eb4d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
