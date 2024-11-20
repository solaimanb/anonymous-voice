"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { LoginCredentials, User } from "@/types/auth.types";
import api from "@/config/axios.config";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: User) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      try {
        return savedUser ? JSON.parse(savedUser) : null;
      } catch {
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = async () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Set token in API headers
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      // Get fresh user data
      const response = await api.get("/api/users");
      console.log("User data fetched:", response.data);

      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.log("Auth initialization failed:", error);
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    const response = await api.post("/api/v1/auth/login", credentials);
    const { token, user } = response.data;

    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const register = async (userData: User) => {
    try {
      await api.post("/api/v1/users/create-mentee", userData);

      await login({
        userName: userData.userName,
        password: userData.password,
      });
    } catch (error) {
      console.log("Registration failed:", error);
      throw new Error("Registration failed");
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
