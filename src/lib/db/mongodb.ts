import { MongoClient, MongoClientOptions, Db } from "mongodb";
import { DatabaseError } from "../utils/errors";

interface MongoDBConfig {
  uri: string;
  dbName: string;
  options: MongoClientOptions;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}

class MongoDB {
  private static instance: MongoDB;
  private client: MongoClient | null = null;
  private clientPromise: Promise<MongoClient>;
  private config: MongoDBConfig;

  private constructor() {
    this.config = this.getConfig();
    this.clientPromise = this.initialize();
  }

  private getConfig(): MongoDBConfig {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;

    if (!uri || !dbName) {
      throw new DatabaseError(
        "missing-mongodb-config",
        "Missing MongoDB configuration",
      );
    }

    return {
      uri,
      dbName,
      options: {
        maxPoolSize: 10,
        minPoolSize: 5,
        retryWrites: true,
        w: "majority",
        connectTimeoutMS: 5000,
        socketTimeoutMS: 30000,
      },
    };
  }

  private initialize(): Promise<MongoClient> {
    if (process.env.NODE_ENV === "development") {
      if (!global._mongoClientPromise) {
        this.client = new MongoClient(this.config.uri, this.config.options);
        global._mongoClientPromise = this.client.connect();
      }
      return global._mongoClientPromise;
    }

    this.client = new MongoClient(this.config.uri, this.config.options);
    return this.client.connect();
  }

  public static getInstance(): MongoDB {
    if (!MongoDB.instance) {
      MongoDB.instance = new MongoDB();
    }
    return MongoDB.instance;
  }

  public async getDb(): Promise<Db> {
    const client = await this.clientPromise;
    return client.db(this.config.dbName);
  }

  public getClient(): Promise<MongoClient> {
    return this.clientPromise;
  }
}

export const mongodb = MongoDB.getInstance();
