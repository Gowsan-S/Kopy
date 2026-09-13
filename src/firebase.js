import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBK-0t8LNfkaqLwn1IkWkgeHS5fQ4SwyCg",
  authDomain: "kopy-e4760.firebaseapp.com",
  projectId: "kopy-e4760",
  storageBucket: "kopy-e4760.firebasestorage.app",
  messagingSenderId: "579625117551",
  appId: "1:579625117551:web:4caf6c7c1bf05cae6eaa9a"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);