import { User as firebaseUser } from "firebase/auth";

export interface UserCustomClaims {
  role?: "user" | "admin" | "volunteer";
  permissions?: string[];
  [key: string]: string | string[] | undefined;
}

export interface ExtendedUser extends firebaseUser {
  claims?: UserCustomClaims;
}

export interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  isAuthenticated: boolean;
}
