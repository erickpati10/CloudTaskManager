import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import {
  getAuth,
  signInAnonymously,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTV92CI95LblTbYEZGxP--Lf4JNxhNvJM",
  authDomain: "cloudtaskmanager-25741.firebaseapp.com",
  projectId: "cloudtaskmanager-25741",
  storageBucket: "cloudtaskmanager-25741.firebasestorage.app",
  messagingSenderId: "324048530388",
  appId: "1:324048530388:web:c22df36f01795341734441",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Sign in anonymously
const authReady = signInAnonymously(auth)
  .then((userCredential) => {
    console.log("Firebase connected successfully!");
    console.log("User ID:", userCredential.user.uid);
    return userCredential.user;
  })
  .catch((error) => {
    console.error("Firebase authentication error:", error.code, error.message);
    throw error;
  });

// Export for use in script.js
export { db, auth, authReady };
