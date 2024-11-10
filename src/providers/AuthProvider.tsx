"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
// import { UserCustomClaims } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        document.cookie = `auth-token=${await user.getIdToken()}; path=/`;
      } else {
        document.cookie =
          "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  const router = useRouter();

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const authMethods = {
    ...context,

    requireAuth: (callback?: () => void) => {
      if (!context.user && !context.loading) {
        const currentPath = window.location.pathname;
        router.push(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
      } else if (callback) {
        callback();
      }
    },

    signOut: async () => {
      await auth.signOut();
      router.push("/login");
    },

    // hasRole: (role: UserCustomClaims['role']) => {
    //   return context.user?.claims?.role === role;
    // },

    // hasPermission: (permission: string) => {
    //   return context.user?.claims?.permissions?.includes(permission);
    // },

    // getUserClaims: () => {
    //   return context.user?.claims ?? null
    // }
  };
  return authMethods;
};

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  return function WithAuthComponent(props: P) {
    const { loading, isAuthenticated, requireAuth } = useAuth();

    useEffect(() => {
      requireAuth();
    }, [requireAuth]);

    if (loading) {
      return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
