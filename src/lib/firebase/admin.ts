import { cert, initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Create a function to validate environment variables
function validateEnvVariables() {
  const requiredVars = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Firebase Admin environment variables: ${missingVars.join(", ")}`,
    );
  }

  return requiredVars as { [key: string]: string };
}

// Create a function to initialize Firebase Admin
function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    return;
  }

  try {
    const { projectId, clientEmail, privateKey } = validateEnvVariables();

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        // Ensure proper private key formatting
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
    });
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    throw error;
  }
}

// Initialize on module load
initializeFirebaseAdmin();

// Export the admin auth instance
export const adminAuth = getAuth();

// Export initialization function for explicit initialization if needed
export { initializeFirebaseAdmin };
