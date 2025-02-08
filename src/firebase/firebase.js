import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';



// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAaOhb7xKwiC34F21YvPFP6XjCnmZLvHww",
    authDomain: "kpd-reception.firebaseapp.com",
    projectId: "kpd-reception",
    storageBucket: "kpd-reception.firebasestorage.app",
    messagingSenderId: "132817952102",
    appId: "1:132817952102:web:a14ccc852a21be0446fca7",
    measurementId: "G-9XT25XGCBW"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };