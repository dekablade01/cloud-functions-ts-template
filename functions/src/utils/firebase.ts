import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase if not already initialized
const app = getApps().length === 0 ? initializeApp() : getApp();

// Get Firestore instance
export const firestore = getFirestore(app);

// Export app for other Firebase services if needed
export const firebase = app; 