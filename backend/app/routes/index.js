import express from 'express'
import authRoute from './auth.routes.js'
import logsRoute from './logs.routes.js'

const router = express.Router()

router.use('/auth', authRoute)
router.use('/logs', logsRoute)

export default router
