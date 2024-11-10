import { MongoClient, MongoClientOptions } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 5,
  retryWrites: true,
  w: 'majority',
  connectTimeoutMS: 5000,
  socketTimeoutMS: 30000,
};

declare global {
  // Allow global `var` declarations
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}

class MongoDB {
  private static instance: MongoDB;
  private _client: MongoClient | null = null;
  private _clientPromise: Promise<MongoClient>;

  private constructor() {
    if (process.env.NODE_ENV === 'development') {
      if (!global._mongoClientPromise) {
        this._client = new MongoClient(uri, options);
        global._mongoClientPromise = this._client.connect();
      }
      this._clientPromise = global._mongoClientPromise;
    } else {
      this._client = new MongoClient(uri, options);
      this._clientPromise = this._client.connect();
    }
  }

  public static getInstance(): MongoDB {
    if (!MongoDB.instance) {
      MongoDB.instance = new MongoDB();
    }
    return MongoDB.instance;
  }

  get client(): Promise<MongoClient> {
    return this._clientPromise;
  }
}

export default MongoDB.getInstance();