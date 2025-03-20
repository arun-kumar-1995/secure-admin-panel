import express from 'express'
import {
  getLocalIp,
  requestOtp,
  verifyOtp,
  ipLogin,
  directLogin,
  blockIpAddress
} from '../controlers/auth.controller.js';

const router = express.Router()

router.route('/get-ip').get(getLocalIp)
router.route('/direct-login').get(directLogin)
router.route('/send-otp').post(requestOtp)
router.route('/verify-otp').post(verifyOtp)
router.route('/ip-login').post(ipLogin)
router.route('/block-ip-address').post(blockIpAddress)


export default router
