import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVjvznBKu1jJYS3STOd-le7Bmn8ToRe1s",
  authDomain: "notenetra.firebaseapp.com",
  databaseURL: "https://notenetra-default-rtdb.firebaseio.com",
  projectId: "notenetra",
  storageBucket: "notenetra.firebasestorage.app",
  messagingSenderId: "262092357638",
  appId: "1:262092357638:web:770c2e8f187a0ebc334387",
  measurementId: "G-1F2RGLK7RZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app; 