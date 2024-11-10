import { NextResponse } from 'next/server';
import { createOrUpdateUser } from '@/lib/db/users';
import { adminAuth } from '@/lib/firebase/admin.';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      // Verify the token using admin SDK
      const decodedToken = await adminAuth.verifyIdToken(token);
      // Get the full user object
      const firebaseUser = await adminAuth.getUser(decodedToken.uid);

      // Create or update user in MongoDB
      const result = await createOrUpdateUser(firebaseUser);

      return NextResponse.json(result);
    } catch (firebaseError) {
      console.error('Firebase auth error:', firebaseError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
