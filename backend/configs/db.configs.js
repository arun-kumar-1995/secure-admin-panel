import mongoose from 'mongoose'
import { logger as log } from '../app/shared/logger.shared.js'

export const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true)
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME,
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      maxPoolSize: 10, // Optimize for performance with connection pooling
      minPoolSize: 2, // Keep minimum connections alive
      serverSelectionTimeoutMS: 5000, // Prevent long waits on startup
      socketTimeoutMS: 45000, // Keep sockets open for better performance
    })

    log.info(`[MongoDB Connected] \n ${conn.connection.host}`);
  } catch (err) {
    if (err.name === 'MongoNetworkError') {
      log.error('Network issue. Unable to reach MongoDB.')
    } else if (err.name === 'MongoServerSelectionError') {
      log.error('Database connection failed. Please check MongoDB server.')
    } else if (err.code === 18) {
      log.error('Authentication failed. Check database credentials.')
    }
    log.error(`[MongoDB Connection Error] \n ${err.message}`)
    process.exit(1)
  }
}
