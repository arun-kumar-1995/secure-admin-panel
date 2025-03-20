import express from 'express'
import {
  checkAuth,
  requestOtp,
  verifyOtp,
  ipLogin
} from '../controlers/auth.controller.js'
const router = express.Router()

router.route('/').post(checkAuth)
router.route('/send-otp').post(requestOtp)
router.route('/verify-otp').post(verifyOtp);
router.route("/ip-login").post(ipLogin);

export default router
