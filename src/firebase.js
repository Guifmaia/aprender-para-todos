import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFFVZ0UWTyX3L7lDygtlum-ni8LY_y_hk",
  authDomain: "aprenderparatodos-9f59b.firebaseapp.com",
  projectId: "aprenderparatodos-9f59b",
  storageBucket: "aprenderparatodos-9f59b.firebasestorage.app",
  messagingSenderId: "863261218181",
  appId: "1:863261218181:web:c4fb1ceb852a9589efa0ec"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);