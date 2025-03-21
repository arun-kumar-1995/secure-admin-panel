import express from 'express'
import {
  getLocalIp,
  requestOtp,
  verifyOtp,
  ipLogin,
  blockIpAddress,
  register,
} from '../controlers/auth.controller.js'

const router = express.Router()

router.route('/sign-in').post(register)
router.route('/get-ip').get(getLocalIp)
router.route('/send-otp').post(requestOtp)
router.route('/verify-otp').post(verifyOtp)
router.route('/ip-login').post(ipLogin)
router.route('/block-ip-address').post(blockIpAddress)

export default router
