# 🚀 NoteNetra Deployment Guide

Choose your preferred deployment platform from the options below:

## **Option 1: Vercel (Recommended - Free & Fastest)**

### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

### **Step 2: Build the Application**
```bash
cd notenetra_website
npm run build
```

### **Step 3: Deploy to Vercel**
```bash
vercel
```

### **Step 4: Follow the Prompts**
- Login to Vercel (if not already logged in)
- Choose to link to existing project or create new
- Confirm deployment settings
- Wait for deployment to complete

**Your app will be live at:** `https://your-project-name.vercel.app`

---

## **Option 2: Netlify (Free & Easy)**

### **Step 1: Build the Application**
```bash
cd notenetra_website
npm run build
```

### **Step 2: Deploy to Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### **Step 3: Follow the Prompts**
- Login to Netlify
- Choose to create new site
- Confirm deployment

**Your app will be live at:** `https://your-site-name.netlify.app`

---

## **Option 3: Firebase Hosting (Recommended for Firebase Projects)**

### **Step 1: Install Firebase CLI**
```bash
npm install -g firebase-tools
```

### **Step 2: Login to Firebase**
```bash
firebase login
```

### **Step 3: Initialize Firebase (if not already done)**
```bash
cd notenetra_website
firebase init hosting
```

### **Step 4: Build and Deploy**
```bash
npm run build
firebase deploy
```

**Your app will be live at:** `https://your-project-id.web.app`

---

## **Option 4: GitHub Pages**

### **Step 1: Update vite.config.mjs**
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // Add this line
  // ... rest of config
})
```

### **Step 2: Build and Deploy**
```bash
npm run build
# Push dist folder to gh-pages branch
```

---

## **Option 5: Manual Deployment (Any Web Server)**

### **Step 1: Build the Application**
```bash
cd notenetra_website
npm run build
```

### **Step 2: Upload dist folder**
Upload the contents of the `dist` folder to your web server.

---

## **🚨 Important: Environment Variables**

Before deploying, make sure your Firebase configuration is properly set:

### **For Vercel:**
1. Go to your project dashboard
2. Settings → Environment Variables
3. Add your Firebase config:
   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=notenetra.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=notenetra
   REACT_APP_FIREBASE_STORAGE_BUCKET=notenetra.firebasestorage.app
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=262092357638
   REACT_APP_FIREBASE_APP_ID=1:262092357638:web:770c2e8f187a0ebc334387
   ```

### **For Netlify:**
1. Go to Site Settings → Environment Variables
2. Add the same Firebase config variables

### **For Firebase Hosting:**
The config is already hardcoded in the app, so no additional setup needed.

---

## **🔧 Post-Deployment Setup**

### **1. Update ESP32 Code**
Update the web dashboard URL in your ESP32 code:
```cpp
// Replace with your deployed URL
String dashboardUrl = "https://your-app-url.com";
```

### **2. Test the Integration**
1. Visit your deployed URL
2. Register a new account
3. Test login functionality
4. Verify Firebase connection

### **3. Update Firestore Rules**
Deploy the security rules:
```bash
firebase deploy --only firestore:rules
```

---

## **📊 Deployment Status Check**

After deployment, verify these features work:

- ✅ User registration and login
- ✅ Firebase authentication
- ✅ Real-time device monitoring
- ✅ Transaction display
- ✅ Responsive design

---

## **🎯 Quick Deploy Commands**

### **Vercel (Fastest)**
```bash
cd notenetra_website
npm run build
vercel --prod
```

### **Netlify**
```bash
cd notenetra_website
npm run build
netlify deploy --prod --dir=dist
```

### **Firebase**
```bash
cd notenetra_website
npm run build
firebase deploy
```

---

## **🆘 Troubleshooting**

### **Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Firebase Connection Issues**
- Verify Firebase project ID is correct
- Check if Firestore is enabled
- Ensure authentication is configured

### **Routing Issues**
- Make sure the deployment platform supports SPA routing
- Check that all routes redirect to index.html

---

## **📱 Mobile Testing**

After deployment, test on mobile devices:
- Responsive design
- Touch interactions
- Real-time updates
- Authentication flow

---

**Choose your preferred platform and follow the steps above. Vercel is recommended for the fastest and easiest deployment!** 🚀 