import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define mongodb_uri in env variables.");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10, 
    };

    // cached.promise = mongoose.connect(MONGODB_URI as string, opts).then(() => mongoose.connection);
    // mongoose.connect() = method to establish connection
    // mongoose.connection = property that holds the connection object
    mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
