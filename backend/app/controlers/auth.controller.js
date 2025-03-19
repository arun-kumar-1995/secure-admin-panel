import { CatchAsyncError } from '../shared/catchAsyncError.shared.js'
import { ApiResponse } from '../shared/apiResponse.shared.js'
import { User } from '../models/user.models.js'
import { OTP } from '../models/otp.models.js'
import { ErrorHandler } from '../shared/errorHandler.shared.js'

import os from 'os'

export const checkAuth = CatchAsyncError(async (req, res, next) => {
  const interfaces = os.networkInterfaces()

  console.log('--------', interfaces)
  ApiResponse(res, 200, 'Ok')
})

export const register = CatchAsyncError(async (req, res, next) => {
  const { email } = req.body

  let user = await User.findOne({ email })
  if (user) return ErrorHandler(res, 403, 'Email already in use')
  user = await User.create(email)
  return ApiResponse(res, 200, 'User registered', { user })
})
export const requestOtp = CatchAsyncError(async (req, res, next) => {})

export const verifyOtp = CatchAsyncError(async (req, res, next) => {
  const { email, otp } = req.body
  if (!email) return ErrorHandler(res, 400, 'Email is required')

  if (!otp) return ErrorHandler(res, 400, 'Otp is required')

  const validOtp = await OTP.findOne({
    email,
    otp,
    expiresAt: { $gt: new Date() },
  })

  if (!validOtp) return ErrorHandler(res, 400, 'Invalid or expired OTP')

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: parseInt(TOKEN_EXPIRE, 10) * 60 * 60 * 1000,
    sameSite: 'strict',
  })
})
