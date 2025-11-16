// lib/db.ts
import mongoose from 'mongoose';


const MONGODB_URI = process.env.MONGODB_URI as string;


if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env');


let cached: { conn: any; promise: any } = (global as any)._mongo || { conn: null, promise: null };


if (!cached.promise) {
cached.promise = mongoose.connect(MONGODB_URI).then((m) => m.connection);
(global as any)._mongo = cached;
}


export default async function dbConnect() {
if (cached.conn) return cached.conn;
cached.conn = await cached.promise;
return cached.conn;
}
