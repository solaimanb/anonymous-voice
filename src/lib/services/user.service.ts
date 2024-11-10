import { FirebaseService } from '../firebase/config';
import MongoDB from '../mongodb/client';
import { ObjectId } from 'mongodb';

interface UserData {
  _id?: ObjectId;
  firebaseUid: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserService {
  private static instance: UserService;
  private firebase = FirebaseService.getInstance();
  private mongodb = MongoDB;

  private constructor() { }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async createUser(userData: Partial<UserData>): Promise<UserData> {
    const client = await this.mongodb.client;
    const db = client.db(process.env.MONGODB_DB);

    const newUser: UserData = {
      firebaseUid: userData.firebaseUid!,
      email: userData.email!,
      displayName: userData.displayName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<UserData>('users').insertOne(newUser);
    return { ...newUser, _id: result.insertedId };
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<UserData | null> {
    const client = await this.mongodb.client;
    const db = client.db(process.env.MONGODB_DB);

    return db.collection<UserData>('users').findOne({ firebaseUid });
  }

  async updateUser(firebaseUid: string, updateData: Partial<UserData>): Promise<boolean> {
    const client = await this.mongodb.client;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection<UserData>('users').updateOne(
      { firebaseUid },
      {
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );

    return result.modifiedCount > 0;
  }
}
