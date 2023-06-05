import { initializeApp, getApps, FirebaseApp } from "firebase/app";

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "legend-9f8bf.firebaseapp.com",
  projectId: "legend-9f8bf",
  storageBucket: "legend-9f8bf.appspot.com",
  messagingSenderId: "1088916342094",
  appId: "1:1088916342094:web:5f9b49360b4200871e0a1f",
  measurementId: "G-6C9EM64GW6",
};

export function getFirebaseApp(): FirebaseApp | undefined {
  if (!getApps().length) {
    return initializeApp(config);
  }
  return getApps()[0];
}
