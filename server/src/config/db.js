import mongoose from 'mongoose';

export const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const mongoUri = process.env.MONGO_URI;

  if (isProduction && !mongoUri) {
    console.error('FATAL CONFIGURATION ERROR: MONGO_URI environment variable is required in production mode.');
    process.exit(1);
  }

  const targetUri = mongoUri || 'mongodb://127.0.0.1:27017/codechef_club';

  // Handle Mongoose connection events
  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB connection lost. Reconnecting...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB successfully reconnected.');
  });

  try {
    const conn = await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

