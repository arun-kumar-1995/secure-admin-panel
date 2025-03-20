import express from 'express'
import { getAccessLogs } from '../controlers/logs.controller'

const router = express.Router()

router.route('/get-logs').get(getAccessLogs)

export default router
