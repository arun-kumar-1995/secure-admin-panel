import { CatchAsyncError } from '../shared/catchAsyncError.shared.js'
import { ApiResponse } from '../shared/apiResponse.shared.js'
import { User } from '../models/user.models.js'
import { OTP } from '../models/otp.models.js'
import { ErrorHandler } from '../shared/errorHandler.shared.js'
import { sendEmail } from '../shared/sendEmail.shared.js'
import { GenerateOtp } from '../shared/generateOtp.shared.js'
import jwt from 'jsonwebtoken'

import { getLocalIP } from '../shared/getLocalIp.shared.js'
import { Logs } from '../models/logs.models.js'
import { isValidLocalIP } from '../shared/validateIp.shared.js'
import { IpBlocked } from '../models/blokedIps.models.js'

export const getLocalIp = CatchAsyncError(async (req, res, next) => {
  const ip = getLocalIP()
  ApiResponse(res, 200, 'Client Local Ip', { ip })
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
  const { email, otp, deviceInfo } = req.body
  if (!email) return ErrorHandler(res, 400, 'Email is required')

  if (!otp) return ErrorHandler(res, 400, 'Otp is required')

  const validOtp = await OTP.findOne({ email }).sort({ createdAt: -1 })

  if (!validOtp) return ErrorHandler(res, 400, 'Invalid or expired OTP')

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })
  // Delete OTP after successful verification (optional)
  await OTP.deleteOne({ _id: validOtp._id })

  // CREATE LOGS
  await Logs.create({
    ip: staticIP,
    deviceInfo,
    status: 'Success',
  })

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

export const directLogin = CatchAsyncError(async (req, res, next) => {
  const { ip, deviceInfo } = req.body

  if (!ip) return ErrorHandler(res, 400, 'Ip Address is required')

  // validate ip address
  if (!isValidLocalIP(ip))
    return ErrorHandler(res, 400, 'Invalid Local IP Address')

  // create logs
  await Logs.create({
    ip: staticIP,
    deviceInfo,
    status: 'Success',
  })

  ApiResponse(res, 200, 'Successfully loggedin')
})

export const ipLogin = CatchAsyncError(async (req, res, next) => {
  const { staticIP, deviceInfo } = req.body
  if (!staticIP) return ErrorHandler(res, 400, 'Enter Ip Address')

  const user = await User.findOne({ staticIP })
  if (!user) return ErrorHandler(res, 403, 'user not found')

  // if static ip assignned is not same then
  // lock account process for 5 attempt and send email

  if (user.staticIP !== staticIP) {
    user[loginAttempts] = user.loginAttempts + 1
    await user.save()

    // CREATE LOGS
    await Logs.create({
      ip: staticIP,
      deviceInfo,
      status: 'Failed',
    })
  }

  if (user.loginAttempts > 5) {
    // send email
    sendEmailToAdmin(staticIP)
    return ErrorHandler(res, 403, 'Your account is locked')
  }

  // CREATE LOGS
  await Logs.create({
    ip: staticIP,
    deviceInfo,
    status: 'Success',
  })

  // send response
  ApiResponse(res, 200, `You are logged in`)
})

export const blockIpAddress = CatchAsyncError(async (req, res, next) => {
  const { ip } = req.body

  if (!ip)
    return ErrorHandler(
      res,
      400,
      'Ip address is required to automatically blocked'
    )

  // blocked ip address
  const blocked = await IpBlocked.create({ ip })

  ApiResponse(res, 200, 'Ip address is blocked')
})
