import { NextResponse } from "next/server";
import { createOrUpdateUser } from "@/lib/db/users";
import { adminAuth } from "@/lib/firebase/admin";
import { DecodedIdToken } from "firebase-admin/auth";

// Custom error class for API errors
class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
  ) {
    super(message);
    this.name = "APIError";
  }
}

async function verifyAuthToken(
  authHeader: string | null,
): Promise<DecodedIdToken> {
  if (!authHeader?.startsWith("Bearer ")) {
    throw new APIError(
      "Missing or invalid authorization header",
      401,
      "invalid_auth_header",
    );
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    return await adminAuth.verifyIdToken(token);
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new APIError("Invalid or expired token", 401, "invalid_token");
  }
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const decodedToken = await verifyAuthToken(
      request.headers.get("Authorization"),
    );

    // Get full user profile
    const firebaseUser = await adminAuth
      .getUser(decodedToken.uid)
      .catch((error) => {
        console.error("Failed to fetch user profile:", error);
        throw new APIError("User not found", 404, "user_not_found");
      });

    // Create or update user in MongoDB
    const result = await createOrUpdateUser(firebaseUser).catch((error) => {
      console.error("Database operation failed:", error);
      throw new APIError("Failed to update user profile", 500, "db_error");
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof APIError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.statusCode },
      );
    }

    console.error("Unhandled server error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        code: "internal_error",
      },
      { status: 500 },
    );
  }
}
