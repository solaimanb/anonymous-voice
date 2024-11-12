import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

class FirebaseClient {
  private static instance: FirebaseClient;
  private app: FirebaseApp;
  private auth: Auth;
  private db: Firestore;

  private constructor() {
    try {
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      };

      this.app = !getApps().length
        ? initializeApp(firebaseConfig)
        : getApps()[0];
      this.auth = getAuth(this.app);
      this.db = getFirestore(this.app);
    } catch (error) {
      console.error("Error initializing Firebase:", error);
      throw error;
    }
  }

  private getRequiredEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
      throw new Error(
        `Missing required environment variable: ${name}. Please check your .env.local file.`,
      );
    }
    return value;
  }

  public static getInstance(): FirebaseClient {
    if (!FirebaseClient.instance) {
      FirebaseClient.instance = new FirebaseClient();
    }
    return FirebaseClient.instance;
  }

  public getApp(): FirebaseApp {
    return this.app;
  }

  public getAuth(): Auth {
    return this.auth;
  }

  public getDb(): Firestore {
    return this.db;
  }
}

export const firebase = FirebaseClient.getInstance();
export const auth = firebase.getAuth();
export const db = firebase.getDb();
