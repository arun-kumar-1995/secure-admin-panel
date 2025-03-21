import './configs/loadEnv.configs.js'
import log from './app/shared/logger.shared.js'
import app from './app/app.js'
import connectDB from './configs/db.configs.js'

const { PORT: port = 8000 } = process.env

const startServer = async () => {
  try {
    // connect to db
    // await connectDB();
    app.listen(port, (err) => {
      if (err) {
        log.error(`Error ${err.message}`)
        process.exit(1)
      }
      log.info(`[Server started]:\n http://localhost:${port}`)
    })
  } catch (err) {
    log.error('Failed to start server', err)
    process.exit(1)
  }
}

startServer()
