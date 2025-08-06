import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Function to register a new user
export async function registerUser(email, password, userData) {
    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store additional user data in Realtime Database
        await set(ref(db, 'users/' + user.uid), {
            ...userData,
            email: email,
            createdAt: new Date().toISOString(),
            profileCompleted: false
        });

        return { user, profileCompleted: false };
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

// Function to login user
export async function loginUser(email, password) {
    try {
        // Sign in user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User signed in successfully:', user.uid);

        // Get user data from Realtime Database
        const userRef = ref(db, 'users/' + user.uid);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            return { user, profileCompleted: userData.profileCompleted || false };
        } else {
            // If no user data exists, create it
            await set(userRef, {
                email: email,
                createdAt: new Date().toISOString(),
                profileCompleted: false
            });
            return { user, profileCompleted: false };
        }
    } catch (error) {
        console.error('Login error:', error);
        throw new Error('Invalid email or password. Please try again.');
    }
}

// Function to logout user
export async function logoutUser() {
    try {
        await signOut(auth);
        // Clear any stored data
        localStorage.clear();
        sessionStorage.clear();
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

// Function to check if user is logged in
export function isUserLoggedIn() {
    return auth.currentUser !== null;
}

// Function to get current user
export function getCurrentUser() {
    return auth.currentUser;
} 