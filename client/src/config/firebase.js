import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCV0F4pVCNYeZkI1SASVuJxrqZBT5WLP1I",
  authDomain: "employee-management-syst-c2e9a.firebaseapp.com",
  projectId: "employee-management-syst-c2e9a",
  storageBucket: "employee-management-syst-c2e9a.firebasestorage.app",
  messagingSenderId: "811046965472",
  appId: "1:811046965472:web:6f91e988d3b5f1f222c085"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
