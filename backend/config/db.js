const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blog_platform';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Primary MongoDB Connection failed (${error.message}). Initializing fallback in-memory MongoDB server...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`Fallback In-Memory MongoDB Connected: ${conn.connection.host}`);
    } catch (fallbackError) {
      console.error(`MongoDB Connection Error: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
