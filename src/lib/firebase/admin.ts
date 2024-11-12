import { cert, getApps, initializeApp, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { AuthError } from "../utils/errors";

interface FirebaseAdminConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

class FirebaseAdmin {
  private static instance: FirebaseAdmin;
  private app: App;
  private auth: Auth;

  private constructor() {
    const config = this.getConfig();

    if (getApps().length === 0) {
      this.app = initializeApp({
        credential: cert(config),
      });
    } else {
      this.app = getApps()[0];
    }

    this.auth = getAuth(this.app);
  }

  private getConfig(): FirebaseAdminConfig {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (!projectId || !clientEmail || !privateKey) {
      throw new AuthError(
        "missing-admin-credentials",
        "Missing Firebase Admin credentials",
      );
    }

    return { projectId, clientEmail, privateKey };
  }

  public static getInstance(): FirebaseAdmin {
    if (!FirebaseAdmin.instance) {
      FirebaseAdmin.instance = new FirebaseAdmin();
    }
    return FirebaseAdmin.instance;
  }

  public getAuth(): Auth {
    return this.auth;
  }
}

export const adminAuth = FirebaseAdmin.getInstance().getAuth();
