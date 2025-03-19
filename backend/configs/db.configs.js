import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: process.env.DB_NAME,
    })
    console.log(`[MongoDB Connected] \n ${conn.connection.host}`)
  } catch (err) {
    console.error('ERROR: ' + err.message)
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
