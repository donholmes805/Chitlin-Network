import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDmVoFq7Hqxx4XFwymNnIsPeF1j3gIyN8M",
  authDomain: "chitlin-network-tv-805.firebaseapp.com",
  projectId: "chitlin-network-tv-805",
  storageBucket: "chitlin-network-tv-805.firebasestorage.app",
  messagingSenderId: "213518137870",
  appId: "1:213518137870:web:7146f6ff0db351a7349a5f"
};

// Initialize Firebase for SSR
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { app, auth, db, storage, functions };
