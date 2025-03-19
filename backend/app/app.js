import express from 'express'
const app = express()

import cors from 'cors'
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
// import appRoute from './src/routes/index.js'
// app.use('/app/v1', appRoute)


export default app