import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBlb_6Qe-ZLFvamQIgu6-1s2NCf0s-3YjY",
  authDomain: "gymcenter-19beb.firebaseapp.com",
  databaseURL: "https://gymcenter-19beb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gymcenter-19beb",
  storageBucket: "gymcenter-19beb.firebasestorage.app",
  messagingSenderId: "453439380057",
  appId: "1:453439380057:web:0a4bd9368cefd39d936f48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;
