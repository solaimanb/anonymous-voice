import { jwtDecode } from 'jwt-decode';
import { APIError } from "@/app/api/booking/route";
import { apiConfig } from '@/config/api.config';

export interface UserInfo {
  userName: string;
  role: string;
  userDetails: string;
  isVerified: boolean;
}

interface CreateMenteeData {
  userName: string;
  password: string;
  mentee: {
    gender: string;
    age: number;
  };
}

interface LoginData {
  userName: string;
  password: string;
}

interface LoginResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    needsPasswordChange: boolean;
  }
}

export class AuthService {
  static async createMentee(data: CreateMenteeData) {
    const response = await fetch(`${apiConfig.apiUrl}/api/v1/users/create-mentee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new APIError('Failed to create mentee', response.status, 'REGISTRATION_ERROR');
    }

    return response.json();
  }

  static async login(credentials: LoginData) {
    const response = await fetch(`${apiConfig.apiUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new APIError('Login failed', response.status, 'AUTH_ERROR');
    }

    const data: LoginResponse = await response.json();

    if (data.success) {
      const decodedToken = jwtDecode<UserInfo>(data.data.accessToken);
      localStorage.setItem('authToken', data.data.accessToken);
      localStorage.setItem('needsPasswordChange', String(data.data.needsPasswordChange));
      localStorage.setItem('user', JSON.stringify(decodedToken));
    }

    return data;
  }

  static getStoredUser(): UserInfo | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('needsPasswordChange');
    localStorage.removeItem('user');
  }

  static isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  static getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
