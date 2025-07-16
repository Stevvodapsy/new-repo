import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBpg8X1lVqXiPxsHWAFpA6-0zOmd9cQF6I",
  authDomain: "dwello-app.firebaseapp.com",
  projectId: "dwello-app",
  storageBucket: "dwello-app.firebasestorage.app",
  messagingSenderId: "952713433386",
  appId: "1:952713433386:web:ab90215bcb991c039d4e53",
  measurementId: "G-0C9YNH4HVX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);