import { Collection } from "mongodb";
import { mongodb } from "./mongodb";
import { FirebaseUserRecord, UserProfile, NewUserProfile } from "@/types/auth";
import { DatabaseError } from "@/lib/utils/errors";

interface CreateUserResult {
  isNewUser: boolean;
  user: UserProfile;
}

class UserService {
  private collection: Promise<Collection<UserProfile>>;

  constructor() {
    this.collection = this.initialize();
  }

  private async initialize(): Promise<Collection<UserProfile>> {
    try {
      const db = await mongodb.getDb();
      return db.collection<UserProfile>("users");
    } catch (error) {
      console.log(error);
      throw new DatabaseError(
        "collection-initialization-failed",
        "Failed to initialize users collection",
      );
    }
  }

  public async createOrUpdateUser(
    firebaseUser: FirebaseUserRecord,
  ): Promise<CreateUserResult> {
    try {
      const collection = await this.collection;
      const existingUser = await collection.findOne({
        firebaseUID: firebaseUser.uid,
      });

      if (!existingUser) {
        return this.createNewUser(collection, firebaseUser);
      }

      return this.updateExistingUser(collection, existingUser, firebaseUser);
    } catch (error) {
      console.error("Database operation failed:", error);
      throw new DatabaseError(
        "user-operation-failed",
        "Failed to create or update user",
      );
    }
  }

  private async createNewUser(
    collection: Collection<UserProfile>,
    firebaseUser: FirebaseUserRecord,
  ): Promise<CreateUserResult> {
    const newUser: NewUserProfile = {
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

    const result = await collection.insertOne(newUser as UserProfile);
    return {
      isNewUser: true,
      user: { ...newUser, _id: result.insertedId },
    };
  }

  private async updateExistingUser(
    collection: Collection<UserProfile>,
    existingUser: UserProfile,
    firebaseUser: FirebaseUserRecord,
  ): Promise<CreateUserResult> {
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

    if (!updatedUser) {
      throw new DatabaseError(
        "user-update-failed",
        "Failed to update existing user",
      );
    }

    return {
      isNewUser: false,
      user: updatedUser,
    };
  }
}

export const userService = new UserService();
