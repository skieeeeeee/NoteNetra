import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// DOM Elements
const registerForm = document.getElementById('registerForm');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const registerError = document.getElementById('registerError');
const registerBtn = document.getElementById('registerBtn');

// Register function
window.register = async function () {
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Validate inputs
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        showError(registerError, 'Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        showError(registerError, 'Passwords do not match');
        return;
    }

    if (password.length < 6) {
        showError(registerError, 'Password must be at least 6 characters long');
        return;
    }

    try {
        setLoading(registerBtn, true);
        
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store additional user data
        await set(ref(db, `users/${user.uid}`), {
            firstName,
            lastName,
            email,
            phone,
            createdAt: Date.now(),
            profileCompleted: false
        });
        
        // Redirect to profile setup page
        window.location.href = 'profile-setup.html';
        
    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle specific error cases
        if (error.code === 'auth/email-already-in-use') {
            showError(registerError, 'Email is already registered');
        } else if (error.code === 'auth/invalid-email') {
            showError(registerError, 'Invalid email address');
        } else {
            showError(registerError, 'Registration failed. Please try again.');
        }
    } finally {
        setLoading(registerBtn, false);
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