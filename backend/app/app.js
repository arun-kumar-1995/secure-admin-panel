import express from 'express'
const app = express()

import cors from 'cors'
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('trust proxy', true)

// Use CORS middleware
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
// import routes
import appRoute from './routes/index.js'
app.use('/app', appRoute)

// global middleware
import { errorMiddleware } from './middlewares/error.middleware.js'
app.use(errorMiddleware)

export default app
