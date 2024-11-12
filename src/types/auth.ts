import { UserRecord } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { FirebaseApp } from "firebase/app";

export interface UserPreferences {
  notifications: boolean;
  newsletter: boolean;
}

export type UserRole = "admin" | "volunteer" | "user";

export interface BaseUser {
  firebaseUID: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  onboardingComplete: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: UserPreferences;
}

export interface UserProfile extends BaseUser {
  _id: ObjectId;
}

export type NewUserProfile = Omit<UserProfile, "_id">;

export interface AuthError {
  code: string;
  message: string;
}

export interface AuthResponse {
  user: FirebaseApp | null;
  profile: UserProfile | null;
  isNewUser: boolean;
  error: AuthError | null;
}

export interface SignOutResponse {
  error: AuthError | null;
}

export type FirebaseUserRecord = UserRecord;
