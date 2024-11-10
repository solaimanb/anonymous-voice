import { UserRecord } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { clientPromise } from "./mongodb";

export interface UserProfile {
  _id?: ObjectId;
  firebaseUID: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: "admin" | "volunteer" | "user";
  onboardingComplete: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: {
    notifications: boolean;
    newsletter: boolean;
  };
}

export async function createOrUpdateUser(firebaseUser: UserRecord) {
  const client = await clientPromise;
  const collection = client
    .db(process.env.MONGODB_DB)
    .collection<UserProfile>("users");

  const existingUser = await collection.findOne({
    firebaseUID: firebaseUser.uid,
  });

  if (!existingUser) {
    const newUser: Omit<UserProfile, "_id"> = {
      firebaseUID: firebaseUser.uid,
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName || "",
      photoURL: firebaseUser.photoURL || "",
      role: "user",
      onboardingComplete: false,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      preferences: {
        notifications: true,
        newsletter: true,
      },
    };

    const result = await collection.insertOne(newUser);
    return {
      isNewUser: true,
      user: { ...newUser, _id: result.insertedId },
    };
  }

  const updatedUser = await collection.findOneAndUpdate(
    { firebaseUID: firebaseUser.uid },
    {
      $set: {
        lastLoginAt: new Date(),
        email: firebaseUser.email || existingUser.email,
        displayName: firebaseUser.displayName || existingUser.displayName,
        photoURL: firebaseUser.photoURL || existingUser.photoURL,
      },
    },
    { returnDocument: "after" },
  );

  return {
    isNewUser: false,
    user: updatedUser as UserProfile,
  };
}
