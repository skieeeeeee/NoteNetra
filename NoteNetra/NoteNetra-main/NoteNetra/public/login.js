import { auth, db } from './firebase-config.js';
import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('loginError');
const loginBtn = document.getElementById('loginBtn');

// Login function
window.login = async function() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Validate inputs
    if (!email || !password) {
        showError(loginError, 'Please enter both email and password');
        return;
    }

    try {
        setLoading(loginBtn, true);
        
        // Try to sign in
        await signInWithEmailAndPassword(auth, email, password);
        
        // Redirect to dashboard.html after successful login
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error('Login error:', error);
        
        // Handle specific error cases
        if (error.code === 'auth/user-not-found') {
            showError(loginError, 'User not found');
        } else if (error.code === 'auth/wrong-password') {
            showError(loginError, 'Incorrect password');
        } else {
            showError(loginError, 'Login failed. Please try again.');
        }
    } finally {
        setLoading(loginBtn, false);
    }
};

// Show loading state
function setLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Helper function to show errors
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
} 