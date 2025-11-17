import mongoose, { ConnectOptions } from "mongoose";

declare global {
  let mongo: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

const cached = global.mongo || { conn: null, promise: null };

export async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not defined");

    cached.promise = mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
