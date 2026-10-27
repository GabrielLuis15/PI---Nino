
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDUF9vFKVdZGx0biSrAQlGKDdpEJUK1bNI",
  authDomain: "nino-6a445.firebaseapp.com",
  projectId: "nino-6a445",
  storageBucket: "nino-6a445.firebasestorage.app",
  messagingSenderId: "934971699755",
  appId: "1:934971699755:web:112bbecc30c8d9b147f06e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);