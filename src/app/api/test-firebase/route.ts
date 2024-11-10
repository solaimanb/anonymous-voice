import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin.';

export async function GET() {
  try {
    // Test 1: Basic Admin SDK initialization
    const projectId = await adminAuth.app.options.projectId;

    // Test 2: List users (limited to 1 to verify database access)
    const userList = await adminAuth.listUsers(1);

    // Test 3: Verify environment variables
    const envCheck = {
      projectId: !!process.env.FIREBASE_PROJECT_ID,
      clientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    };

    return NextResponse.json({
      status: 'success',
      message: 'Firebase Admin SDK is properly configured',
      tests: {
        adminInitialized: true,
        projectId,
        canListUsers: userList.users.length >= 0,
        environmentVariables: envCheck
      }
    });

  } catch (error: any) {
    console.error('Firebase Admin Test Error:', error);

    return NextResponse.json({
      status: 'error',
      message: 'Firebase Admin SDK configuration test failed',
      error: {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      }
    }, { status: 500 });
  }
}