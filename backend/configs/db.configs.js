import mongoose from 'mongoose'
import { logger as log } from '../app/shared/logger.shared.js'
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    log.warn('[MongoDB] Already Connected');
    return
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Optimize for performance with connection pooling
      minPoolSize: 2, // Keep minimum connections alive
      serverSelectionTimeoutMS: 5000, // Prevent long waits on startup
      socketTimeoutMS: 45000, // Keep sockets open for better performance
    })

    log.info(`[MongoDB Connected] \n ${conn.connection.host}`)
  } catch (err) {
    log.error(`[MongoDB Connection Error] \n ${err.message}`)
    process.exit(1)
  }
}

// handle mongoose error event
const db = mongoose.connection
db.on('error', console.error.bind(console, 'Error connecting to the DB'))

process.on('SIGINT', async () => {
  await db.close()
  console.log('MongoDB connection closed on app termination')
  process.exit(0)
})

export default connectDB
