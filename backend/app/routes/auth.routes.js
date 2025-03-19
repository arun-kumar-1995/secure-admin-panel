import express from 'express'
import {
  checkAuth,
  requestOtp,
  verifyOtp,
} from '../controlers/auth.controller.js'
const router = express.Router()

router.route('/').post(checkAuth)
router.route('/send-otp').post(requestOtp)
router.route('/verify-otp').post(verifyOtp)

export default router
