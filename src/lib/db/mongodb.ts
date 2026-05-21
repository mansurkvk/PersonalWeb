import "server-only";
import { Db, MongoClient, ServerApiVersion } from "mongodb";

type MongoCache = {
  client?: MongoClient;
  promise?: Promise<MongoClient>;
};

const globalForMongo = globalThis as unknown as { mongoCache?: MongoCache };
const cache = globalForMongo.mongoCache ?? {};
globalForMongo.mongoCache = cache;

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI tanimli degil. .env.local veya Vercel env ayarlarini kontrol et.");
  }
  return uri;
}

function getDatabaseName() {
  return process.env.MONGODB_DB_NAME ?? process.env.MONGODB_DB ?? "mansur_platform";
}

// Vercel serverless ortaminda tekrar eden connection olusumunu global cache ile azaltir.
export async function getMongoClient() {
  if (cache.client) return cache.client;

  if (!cache.promise) {
    const client = new MongoClient(getMongoUri(), {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    });
    cache.promise = client.connect();
  }

  cache.client = await cache.promise;
  return cache.client;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(getDatabaseName());
}

export async function pingMongoDb() {
  const client = await getMongoClient();
  await client.db("admin").command({ ping: 1 });
  return {
    ok: true,
    database: getDatabaseName(),
    message: "MongoDB ping basarili."
  };
}
