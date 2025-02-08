import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';



// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBoNW3WxJsgcEmKJ2axxezJzsozUiHLkB4",
    authDomain: "kp-police-complaint.firebaseapp.com",
    projectId: "kp-police-complaint",
    storageBucket: "kp-police-complaint.firebasestorage.app",
    messagingSenderId: "1009906571632",
    appId: "1:1009906571632:web:42e6131bf9866c5889d7b5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };