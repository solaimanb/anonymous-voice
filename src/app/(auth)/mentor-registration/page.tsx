"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useMentorAuth } from "@/hooks/useMentorAuth";

export default function MentorRegistration() {
  const { handleGoogleSignUp, loading } = useMentorAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-12 shadow-sm rounded-[32px] border-[#E8EFF7]">
        <div className="space-y-20 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">Welcome!, Dear Volunteer</h1>
            <p className="text-muted-foreground text-sm">
              Log in to continue your journey of helping others.
            </p>
          </div>

          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="max-w-sm w-full mx-auto flex items-center justify-center gap-2 text-[#4CB5C3] border-2 border-[#4CB5C3] rounded-lg hover:bg-[#4CB5C3]/5 transition-colors py-3 px-4"
          >
            <Image
              src="/images/google.png"
              alt="Google"
              width={50}
              height={50}
              className="w-5 h-5"
            />
            <span className="text-sm">
              {loading ? "Please wait..." : "Login/Signup as Volunteer"}
            </span>
          </button>

          <p className="max-w-md mx-auto text-muted-foreground text-sm">
            By signing up, you agree to the{" "}
            <Link href="/terms" className="text-[#4CB5C3] hover:underline">
              Terms of Service
            </Link>
            ,{" "}
            <Link
              href="/cookie-policy"
              className="text-[#4CB5C3] hover:underline"
            >
              Cookie Policy
            </Link>
            ,{" "}
            <Link
              href="/affiliate-policy"
              className="text-[#4CB5C3] hover:underline"
            >
              Affiliate Policy
            </Link>
            ,{" "}
            <Link
              href="/privacy-policy"
              className="text-[#4CB5C3] hover:underline"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/rules" className="text-[#4CB5C3] hover:underline">
              The Official Rules
            </Link>
            .
          </p>
        </div>
      </Card>
    </div>
  );
}
