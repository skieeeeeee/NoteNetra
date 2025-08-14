# Firebase Integration Setup Guide

This guide will help you set up Firebase integration for your NoteNetra project to enable ESP32 device connectivity and real-time data monitoring.

## Prerequisites

- Firebase project with Firestore database enabled
- ESP32 development board
- WiFi network
- Arduino IDE with ESP32 board support

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Enable Google Analytics (optional)
4. Complete project setup

### 1.2 Enable Authentication
1. In Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable "Email/Password" authentication
3. Enable "Google" authentication (optional)

### 1.3 Enable Firestore Database
1. Go to "Firestore Database" in Firebase Console
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location close to your users

### 1.4 Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" > "Web"
4. Register your app and copy the configuration

## Step 2: Configure Environment Variables

1. Copy `env.example` to `.env` in the `notenetra_website` directory
2. Replace the placeholder values with your actual Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your-actual-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## Step 3: Deploy Firestore Security Rules

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
cd notenetra_website
firebase init firestore
```

4. Deploy the security rules:
```bash
firebase deploy --only firestore:rules
```

## Step 4: ESP32 Setup

### 4.1 Install Required Libraries
In Arduino IDE, install these libraries:
- WiFi (built-in)
- HTTPClient (built-in)
- ArduinoJson (by Benoit Blanchon)
- Time (built-in)

### 4.2 Configure ESP32 Code
1. Open `esp32_example/NoteNetra_ESP32.ino` in Arduino IDE
2. Update the configuration variables:

```cpp
// WiFi Configuration
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Firebase Configuration
const char* FIREBASE_PROJECT_ID = "your-project-id";
const char* USER_EMAIL = "user@example.com";
const char* DEVICE_ID = "esp32_device_001";
```

### 4.3 Upload Code to ESP32
1. Connect ESP32 to your computer
2. Select the correct board and port in Arduino IDE
3. Upload the code
4. Open Serial Monitor to see debug output

## Step 5: Test the Integration

### 5.1 Test User Registration
1. Start the React application:
```bash
cd notenetra_website
npm start
```

2. Navigate to `/register-page`
3. Create a new account with the same email used in ESP32 configuration
4. Verify the user document is created in Firestore

### 5.2 Test ESP32 Connection
1. Power on your ESP32 device
2. Check Serial Monitor for connection status
3. Verify device document is created in Firestore
4. Check that IP address and last_online timestamp are updated

### 5.3 Test Real-time Updates
1. Log in to the web dashboard
2. Navigate to the overview page
3. Verify device status is displayed
4. Check that transaction data updates in real-time

## Step 6: Security Considerations

### 6.1 Production Security Rules
For production, update the Firestore security rules to be more restrictive:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Devices can only be accessed by their owner
    match /devices/{deviceId} {
      allow read, write: if request.auth != null && 
        request.auth.token.email == resource.data.email;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 6.2 ESP32 Authentication
For production, consider implementing:
- Custom authentication tokens for ESP32
- API key-based authentication
- Device-specific credentials

## Troubleshooting

### Common Issues

1. **ESP32 not connecting to WiFi**
   - Check WiFi credentials
   - Verify WiFi signal strength
   - Check Serial Monitor for error messages

2. **Firebase connection errors**
   - Verify project ID is correct
   - Check API key permissions
   - Ensure Firestore is enabled

3. **Real-time updates not working**
   - Check browser console for errors
   - Verify user authentication
   - Check Firestore security rules

4. **Device not appearing in dashboard**
   - Verify email matches between ESP32 and user account
   - Check device document exists in Firestore
   - Ensure user is logged in

### Debug Mode
Enable debug logging by setting:
```javascript
// In firebase.js
console.log('Firebase config:', firebaseConfig);
```

## API Reference

### Device Document Structure
```javascript
{
  email: "user@example.com",
  esp_ip: "192.168.1.100",
  device_id: "esp32_device_001",
  last_online: Timestamp,
  transaction_data: {
    type: "cash|upi|card",
    amount: 1000,
    timestamp: Timestamp
  },
  created_at: Timestamp,
  updated_at: Timestamp
}
```

### Available Functions
- `registerUser(email, password, userData)` - Register new user
- `loginUser(email, password)` - Login user
- `googleLogin()` - Google OAuth login
- `logoutUser()` - Logout user
- `getUserDevices(userEmail)` - Get user's devices
- `listenToUserDevices(userEmail, callback)` - Real-time device monitoring
- `updateDevice(deviceId, deviceData)` - Update device data

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Firebase documentation
3. Check browser console and Serial Monitor for error messages
4. Verify all configuration values are correct 