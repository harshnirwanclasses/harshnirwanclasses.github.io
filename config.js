// =====================================================================
//  HARSH NIRWAN CLASSES — SETTINGS
//  Step 3 of SETUP: paste the "firebaseConfig" values from
//  Firebase Console → Project settings → Your apps → Web app.
// =====================================================================
export const firebaseConfig = {
  apiKey: "AIzaSyDBSNdiZHFdC2IwO5oegUlvcXr6cUSTm5c",
  authDomain: "harsh-nirwan-classes.firebaseapp.com",
  projectId: "harsh-nirwan-classes",
  storageBucket: "harsh-nirwan-classes.firebasestorage.app",
  messagingSenderId: "916091191781",
  appId: "1:916091191781:web:958ef1175f0c335ac0af0c"
};

// File uploads need Firebase Storage (Blaze plan). false = use YouTube / Google Drive links only.
export const USE_STORAGE = false;

// Max upload size the website allows (MB). Keep in sync with storage.rules.
export const MAX_UPLOAD_MB = 500;
