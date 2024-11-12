import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { AuthError } from "@/lib/utils/errors";

interface AuthContextState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthContextState {
  signOut: () => Promise<void>;
  requireAuth: (callback?: () => void) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthContextState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          document.cookie = `auth-token=${token}; path=/; secure; samesite=strict; max-age=3600`;
          setState({ user, loading: false, isAuthenticated: true });
        } catch (error) {
          console.error("Failed to get auth token:", error);
          setState({ user: null, loading: false, isAuthenticated: false });
        }
      } else {
        document.cookie =
          "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setState({ user: null, loading: false, isAuthenticated: false });
      }
    });

    return () => unsubscribe();
  }, []);

  const signOut = async (): Promise<void> => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.log(error);
      throw new AuthError("sign-out-failed", "Failed to sign out");
    }
  };

  const requireAuth = (callback?: () => void): void => {
    if (!state.user && !state.loading) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
    } else if (callback) {
      callback();
    }
  };

  const value: AuthContextValue = {
    ...state,
    signOut,
    requireAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {!state.loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<P> {
  return function WithAuthComponent(props: P) {
    const { loading, isAuthenticated, requireAuth } = useAuth();

    useEffect(() => {
      requireAuth();
    }, [requireAuth]);

    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) return null;

    return <WrappedComponent {...props} />;
  };
}
