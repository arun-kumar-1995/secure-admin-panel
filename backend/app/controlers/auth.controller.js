import { CatchAsyncError } from '../shared/catchAsyncError.shared.js'
import { APIResponse } from '../shared/apiResponse.shared.js'
import { UserModal } from '../models/user.models.js'
import { OTP } from '../schemas/otp.schemas.js'
import { APIError, ErrorHandler } from '../shared/errorHandler.shared.js'
import { sendEmail } from '../shared/sendEmail.shared.js'
import { GenerateOtp } from '../shared/generateOtp.shared.js'
import { getLocalIP } from '../shared/getLocalIp.shared.js'
import { LogStatics } from '../models/logs.models.js'
import { isValidLocalIP } from '../shared/validateIp.shared.js'
import { IpBlocked } from '../models/blokedIps.models.js'
import { generateToken } from '../shared/generateToken.shared.js'
import { sendToken } from '../shared/sendToken.Shared.js'
import { sendEmailToAdmin } from '../shared/sendEmailToAdmin.shared.js'
import { HttpStatus } from '../constants/httpStatus.constants.js'
import { UserService } from '../services/user.services.js'

// log Attempts
export const logAttempt = async (ip, deviceInfo, status) => {
  await Logs.create({ ip: ip || 'Unknown IP', deviceInfo, status })
}

// findUserByEmail
export const findUserByEmail = async (email) => await User.findOne({ email })

export const getLocalIp = CatchAsyncError(async (request, response, next) => {
  const ip = getLocalIP()
  APIResponse(response, 200, 'Client Local Ip', { ip })
})

export const register = CatchAsyncError(async (request, response, next) => {
  const { email } = request.body
  if (!email)
    return APIError(
      response,
      HttpStatus.INVALID_REQUEST,
      "Missing required parameter: - 'email'"
    )

    const user = await UserService.registerUser(response , request.body);
  // let user = await UserModal.findUserByEmail(email);
  // if (user)
  //   return APIError(response, HttpStatus.CONFLICT, 'Email already in use')
  // user = await UserStatics.createUser(email)
  return APIResponse(response, HttpStatus.SUCCESS, 'User registered', { user })
});

export const requestOtp = CatchAsyncError(async (request, response, next) => {
  const { email } = request.body
  if (!email) return ErrorHandler(response, 400, 'Email is required')

  const user = await findUserByEmail(email)
  if (!user) return ErrorHandler(response, 400, 'User not found')

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
  return APIResponse(response, 200, `An otp is send to email ${user.email}`)
})

export const verifyOtp = CatchAsyncError(async (request, response, next) => {
  const { email, otp, deviceInfo, ip } = request.body

  if (!email) return ErrorHandler(response, 400, 'Email is required')
  if (!otp) return ErrorHandler(response, 400, 'OTP is required')

  const validOtp = await OTP.findOne({ email }).sort({ createdAt: -1 })

  if (!validOtp) return ErrorHandler(response, 400, 'Invalid or expired OTP')

  const user = await findUserByEmail(email)

  if (!user) {
    logAttempt(ip, deviceInfo, 'Failed')
    return ErrorHandler(response, 400, 'Invalid email address')
  }
  // Check if OTP entered is the same
  if (otp !== validOtp.otp) {
    user.loginAttempts += 1
    await user.save()

    if (user.loginAttempts >= 5) {
      user.accountStatus = true
      await user.save()

      // Send email to admin
      sendEmailToAdmin(ip)

      return ErrorHandler(response, 400, 'Your profile is locked')
    }

    return ErrorHandler(response, 400, 'Incorrect OTP entered')
  }

  // Reset login attempts on successful OTP verification
  user.loginAttempts = 0
  await user.save()

  // Delete OTP after successful verification
  await OTP.deleteOne({ _id: validOtp._id })

  // CREATE LOGS
  logAttempt(ip, deviceInfo, 'Success')

  // Generate token
  const token = await generateToken(email)
  // Send token in cookie
  sendToken(response, token, 'OTP verified successfully')
})

export const ipLogin = CatchAsyncError(async (request, response, next) => {
  const { staticIP, deviceInfo } = request.body
  if (!staticIP) return ErrorHandler(response, 400, 'Enter Ip Address')

  const user = await User.findOne({ staticIP })
  if (!user) {
    // CREATE LOGS
    logAttempt(staticIP, deviceInfo, 'Failed')
    return ErrorHandler(response, 400, 'Invalid Ip Address entered')
  }
  // if static ip assignned is not same then
  // lock account process for 5 attempt and send email

  if (user.staticIP !== staticIP) {
    user.loginAttempts = user.loginAttempts + 1
    await user.save()

    // CREATE LOGS
    logAttempt(staticIP, deviceInfo, 'Failed')
    return ErrorHandler(response, 400, 'Invalid Ip Address entered')
  }

  if (user.loginAttempts > 5) {
    // send email
    sendEmailToAdmin(staticIP)
    user.accountStatus = true
    await user.save()
    return ErrorHandler(response, 403, 'Your account is locked')
  }

  // CREATE LOGS
  logAttempt(staticIP, deviceInfo, 'Success')

  // generate token
  const token = await generateToken(staticIP)

  // send token in cookie
  sendToken(response, token, 'You are logged in')
})

export const blockIpAddress = CatchAsyncError(
  async (request, response, next) => {
    const { ip } = request.body

    if (!ip) {
      return ErrorHandler(
        response,
        400,
        'IP address is required to be blocked.'
      )
    }

    // Find existing blocked list
    let blockedList = await IpBlocked.findOne()

    if (!blockedList) {
      // Create new document if none exists
      blockedList = await IpBlocked.create({ blockedIps: [ip] })
      return APIResponse(response, 200, 'IP address is successfully blocked.')
    }

    // Check if IP is already blocked
    if (blockedList.blockedIps.includes(ip)) {
      return ErrorHandler(response, 400, 'IP address is already blocked.')
    }

    // Add new IP and save
    blockedList.blockedIps.push(ip)
    await blockedList.save()

    return APIResponse(response, 200, 'IP address is successfully blocked.')
  }
)
