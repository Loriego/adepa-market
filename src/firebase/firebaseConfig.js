import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBGvYFT0H7C8yCg0ZdzOxoIyvClUGP9pbM",
  authDomain: "adepa-market.firebaseapp.com",
  projectId: "adepa-market",
  storageBucket: "adepa-market.firebasestorage.app",
  messagingSenderId: "421017223712",
  appId: "1:421017223712:web:7153e426cb0dc081bd7245",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export const getFirebaseMessaging = async () => {
  const supported = await isSupported();

  return supported ? getMessaging(app) : null;
};