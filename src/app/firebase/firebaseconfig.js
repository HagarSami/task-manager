// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth, sendEmailVerification } from "firebase/auth";
//import { getFirestore } from "firebase/firestore";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrD5quBmAC3oLCowwjcMjtg5LCH7HlW4Y",
  authDomain: "task-manager-app-e45f1.firebaseapp.com",
  projectId: "task-manager-app-e45f1",
  storageBucket: "task-manager-app-e45f1.firebasestorage.app",
  messagingSenderId: "32281047067",
  appId: "1:32281047067:web:4121a2e3574d73b0ee88be"
};

/// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Export auth so other files can use it
export { auth ,db, sendEmailVerification, getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion};