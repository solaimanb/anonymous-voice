import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";

interface GoogleAuthResponse {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    idToken: string;
  };
  existingUser?: boolean;
}

export const useMentorAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      setError(null);

      const googleAuthResponse =
        (await AuthService.handleGoogleMentorSignUp()) as GoogleAuthResponse;

      // Store temporary data in localStorage
      localStorage.setItem("tempMentorUid", googleAuthResponse.user.uid);
      localStorage.setItem(
        "tempMentorName",
        googleAuthResponse.user.displayName || "",
      );
      localStorage.setItem(
        "tempMentorEmail",
        googleAuthResponse.user.email || "",
      );
      localStorage.setItem(
        "tempMentorProfileImage",
        googleAuthResponse.user.photoURL || "",
      );

      // Navigate to onboarding
      router.push("/mentor-registration/onboarding");
    } catch (err: unknown) {
      let errorMessage = "Failed to sign up with Google. Please try again.";
      if (err instanceof Error) {
        errorMessage = err.message;
        console.error("Google Sign-Up Error:", {
          message: err.message,
          fullError: err,
        });
      } else {
        console.error("Google Sign-Up Error:", err);
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { handleGoogleSignUp, loading, error };
};
