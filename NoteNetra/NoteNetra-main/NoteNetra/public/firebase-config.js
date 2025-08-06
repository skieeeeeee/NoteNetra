import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDVjvznBKu1jJYS3STOd-le7Bmn8ToRe1s",
    authDomain: "notenetra.firebaseapp.com",
    projectId: "notenetra",
    storageBucket: "notenetra.appspot.com",
    messagingSenderId: "262092357638",
    appId: "1:262092357638:web:770c2e8f187a0ebc334387",
    databaseURL: "https://notenetra-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };