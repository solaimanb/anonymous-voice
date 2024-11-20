export interface Mentee {
  gender: string;
  age: number;
}

export interface User {
  userName: string;
  password: string;
  mentee?: Mentee;
}

export interface LoginCredentials {
  userName: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}