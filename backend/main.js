'use strict'

import './configs/loadEnv.configs.js'
import { logger as log } from './app/shared/logger.shared.js'
import app from './app/app.js'
import { connectDB } from './configs/db.configs.js'
const { PORT: port = 8000 } = process.env

let server

// Handle Uncaught Exceptions (Sync Errors)
process.on('uncaughtException', (err) => {
  console.error(`💥 Uncaught Exception: ${err.message}`)
  process.exit(1)
})

// Handle Unhandled Promise Rejections (Async Errors)
process.on('unhandledRejection', (reason, promise) => {
  console.error(`⚠️ Unhandled Rejection at:`, promise, 'reason:', reason)
  process.exit(1)
})

const shutdown = async () => {
  console.log('Server Shutdown Initiated...')

  try {
    console.log('Process exiting...')
    process.exit(0)
  } catch (err) {
    console.error(`❌ Shutdown Error: ${err.message}`)
    process.exit(1)
  }
}

const startServer = async () => {
  console.log('===  Server Startup Initiated... ===')
  try {
    // connect to db
    await connectDB()
    server = app.listen(port, (err) => {
      if (err) {
        log.error(`Error ${err.message}`)
        process.exit(1)
      }
      log.warn(`[Server started]:\n http://localhost:${port}`)
    })
  } catch (err) {
    log.error('Failed to start server', err.message)
    process.exit(1)
  }
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

startServer()
