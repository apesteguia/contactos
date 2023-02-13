import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMJ5vRnxpzJ-lj0qVq6_tg3OzxD9YaQjM",
  authDomain: "contactos-9c2f9.firebaseapp.com",
  projectId: "contactos-9c2f9",
  storageBucket: "contactos-9c2f9.appspot.com",
  messagingSenderId: "816678492062",
  appId: "1:816678492062:web:0d9449ac70051f3806288f"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();
auth.languageCode = "es";
const provider = new GoogleAuthProvider();

const db = getFirestore(app);

export { auth, provider, db };