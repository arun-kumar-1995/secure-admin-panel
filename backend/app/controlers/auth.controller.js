import { CatchAsyncError } from '../shared/catchAsyncError.shared.js'
import { ApiResponse } from '../shared/apiResponse.shared.js'
import { User } from '../models/user.models.js'
import { OTP } from '../models/otp.models.js'
import { ErrorHandler } from '../shared/errorHandler.shared.js'
import { sendEmail } from '../shared/sendEmail.shared.js'
import { GenerateOtp } from '../shared/generateOtp.shared.js'
import jwt from 'jsonwebtoken'

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

export const requestOtp = CatchAsyncError(async (req, res, next) => {
  const { email } = req.body
  if (!email) return ErrorHandler(res, 400, 'Email is required')

  const user = await User.findOne({ email })
  if (!user) return ErrorHandler(res, 400, 'User not found')

  // generate 6 digit otp;
  const otp = GenerateOtp()
  // create otp
  const userOtp = await OTP.create({
    email,
    otp,
  })
  // send mail
  sendEmail(user.email, userOtp.otp)

  // send response
  ApiResponse(res, 200, `An otp is send to email ${user.email}`)
})

export const verifyOtp = CatchAsyncError(async (req, res, next) => {
  const { email, otp } = req.body
  if (!email) return ErrorHandler(res, 400, 'Email is required')

  if (!otp) return ErrorHandler(res, 400, 'Otp is required')

  const validOtp = await OTP.findOne({ email }).sort({ createdAt: -1 })

  if (!validOtp) return ErrorHandler(res, 400, 'Invalid or expired OTP')

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })
  // Delete OTP after successful verification (optional)
  await OTP.deleteOne({ _id: validOtp._id })

  res
    .status(200)
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: parseInt(process.env.TOKEN_EXPIRE, 10) * 60 * 1000,
      sameSite: 'strict',
    })
    .json({
      success: true,
      message: 'OTP verified successfully',
      token,
    })
})
