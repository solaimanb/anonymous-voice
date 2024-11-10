import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    // Get the ID token
    const idToken = await result.user.getIdToken();

    // Call your API route with the token
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to create/update user profile');
    }

    const data = await response.json();
    return {
      user: result.user,
      profile: data.user,
      isNewUser: data.isNewUser,
      error: null
    };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return {
      user: null,
      profile: null,
      isNewUser: false,
      error: error.message
    };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};