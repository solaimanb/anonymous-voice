import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
  UserProfile,
} from "firebase/auth";
import { auth } from "./config";

interface AuthResponse {
  user: User | null;
  profile: UserProfile | null;
  isNewUser: boolean;
  error: string | null;
}

interface ErrorResponse {
  error: string;
  code?: string;
}

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<AuthResponse> => {
  try {
    // Sign in with Google
    const result = await signInWithPopup(auth, googleProvider);

    // Get the ID token
    const idToken = await result.user.getIdToken();

    // Call your API route with the token
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();
    return {
      user: result.user,
      profile: data.user,
      isNewUser: data.isNewUser,
      error: null,
    };
  } catch (error) {
    console.error("Sign in error:", error);

    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
      // Handle Firebase Auth specific errors
      if (errorMessage.includes("auth/popup-closed-by-user")) {
        errorMessage = "Sign-in popup was closed before completion";
      } else if (errorMessage.includes("auth/cancelled-popup-request")) {
        errorMessage = "Sign-in was cancelled";
      } else if (errorMessage.includes("auth/popup-blocked")) {
        errorMessage = "Sign-in popup was blocked by the browser";
      }
    }

    return {
      user: null,
      profile: null,
      isNewUser: false,
      error: errorMessage,
    };
  }
};

export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to sign out",
    };
  }
};

// Optional: Add auth state change listener
export const setupAuthListener = (
  callback: (user: User | null) => void,
): (() => void) => {
  return auth.onAuthStateChanged(callback);
};
