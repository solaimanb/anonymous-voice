import { useState, useEffect } from 'react';
import { AuthService } from '@/services/auth.service';

interface UserInfo {
  userName: string;
  role: string;
  userDetails: string;
  isVerified: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const storedUser = AuthService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (userName: string, password: string) => {
    try {
      setLoading(true);
      const response = await AuthService.login({ userName, password });
      const storedUser = AuthService.getStoredUser();
      setUser(storedUser);
      return response;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userName: string, password: string, gender: string, age: number) => {
    try {
      setLoading(true);
      const response = await AuthService.createMentee({
        userName,
        password,
        mentee: {
          gender,
          age
        }
      });
      return response;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
}
