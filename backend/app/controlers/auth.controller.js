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
import { generateToken } from '../shared/generateToken.shared.js'
import { sendToken } from '../shared/sendToken.Shared.js'

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
  const { email, otp, deviceInfo, ip } = req.body
  if (!email) return ErrorHandler(res, 400, 'Email is required')

  if (!otp) return ErrorHandler(res, 400, 'Otp is required')

  const validOtp = await OTP.findOne({ email }).sort({ createdAt: -1 })

  if (!validOtp) return ErrorHandler(res, 400, 'Invalid or expired OTP')

  const user = await User.findOne({ email })
  if (!user) return ErrorHandler(res, 400, 'Invalid email address')

  //  check if opt entered is same
  if (opt === validOtp && user.loginAttempts <= 5) {
    user[loginAttempts] = user.loginAttempts + 1
    await user.save()
    return ErrorHandler(res, 400, 'Incorrect otp entered')
  }

  // after 5 attempt lock the profile

  if (user.loginAttempts > 5) {
    user.accountStatus = true
    await user.save()

    // send email to admin
    sendEmailToAdmin(ip)
    return ErrorHandler(res, 400, 'Your profile is locked')
  }

  // Delete OTP after successful verification (optional)
  await OTP.deleteOne({ _id: validOtp._id })

  // CREATE LOGS
  await Logs.create({
    ip: staticIP,
    deviceInfo,
    status: 'Success',
  })

  // generate token
  const token = generateToken(ip)

  // send token in cookie
  sendToken(res, token, 'OTP verified successfully')
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
    user.accountStatus = true
    await user.save()
    return ErrorHandler(res, 403, 'Your account is locked')
  }

  // CREATE LOGS
  await Logs.create({
    ip: staticIP,
    deviceInfo,
    status: 'Success',
  })

  // generate token
  const token = await generateToken(staticIP)

  // send token in cookie
  sendToken(res, token, 'You are logged in')
})

export const blockIpAddress = CatchAsyncError(async (req, res, next) => {
  const { ip } = req.body

  if (!ip) {
    return ErrorHandler(res, 400, 'IP address is required to be blocked.')
  }

  // Find existing blocked list
  let blockedList = await IpBlocked.findOne()

  if (!blockedList) {
    // Create new document if none exists
    blockedList = await IpBlocked.create({ blockedIps: [ip] })
    return ApiResponse(res, 200, 'IP address is successfully blocked.')
  }

  // Check if IP is already blocked
  if (blockedList.blockedIps.includes(ip)) {
    return ErrorHandler(res, 400, 'IP address is already blocked.')
  }

  // Add new IP and save
  blockedList.blockedIps.push(ip)
  await blockedList.save()

  return ApiResponse(res, 200, 'IP address is successfully blocked.')
})
