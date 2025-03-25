import { CatchAsyncError } from '../shared/catchAsyncError.shared.js'
import { APIResponse } from '../shared/apiResponse.shared.js'
import { UserModal } from '../models/user.models.js'
import { OTP } from '../schemas/otp.schemas.js'
import { APIError, ErrorHandler } from '../shared/errorHandler.shared.js'
import { sendEmail } from '../shared/sendEmail.shared.js'
import { GenerateOtp } from '../shared/generateOtp.shared.js'
import { getLocalIP } from '../shared/getLocalIp.shared.js'
import { LogModel } from '../models/logs.models.js'
import { isValidLocalIP } from '../shared/validateIp.shared.js'
import { IpBlocked } from '../models/blokedIps.models.js'
import { generateToken } from '../shared/generateToken.shared.js'
import { sendToken } from '../shared/sendToken.Shared.js'
import { sendEmailToAdmin } from '../shared/sendEmailToAdmin.shared.js'
import { HttpStatus } from '../constants/httpStatus.constants.js'
import { UserService } from '../services/user.services.js'
import { validate } from '../shared/validation.shared.js'
import { OtpService } from '../services/otp.services.js'
import { EmailService } from '../services/email.services.js'
import { LogService } from '../services/logs.service.js'
import { AuthService } from '../services/auth.service.js'

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

  // const validation = validate(request.body, { email })
  // if (!validation.isValid) {
  // }
  if (!email) {
    throw new APIError(
      HttpStatus.INVALID_REQUEST,
      "Missing required parameter: - 'email'"
    )
  }

  const user = await UserService.registerUser(response, request.body)
  return APIResponse(response, HttpStatus.SUCCESS, 'User registered', { user })
})

export const requestOtp = CatchAsyncError(async (request, response, next) => {
  const { email } = request.body
  if (!email)
    return APIError(
      response,
      HttpStatus.INVALID_REQUEST,
      "Missing required parameter: - 'email'"
    )

  const user = await UserService.validateUserByEmail(email)
  if (!user)
    return APIError(
      response,
      HttpStatus.NOT_FOUND,
      `Email:'${email}' is not registered`
    )

  const userOtp = await OtpService.creatOtp(response, email)

  // send mail
  if (userOtp) {
    const emailText = `An OTP with a 6-digit code: ${userOtp}`
    await EmailService.sendEmail(response, user.email, emailText)
  }

  // send response
  return APIResponse(
    response,
    HttpStatus.SUCCESS,
    `An otp is send to email ${user.email}`
  )
})

export const verifyOtp = CatchAsyncError(async (request, response, next) => {
  const { email, otp, deviceInfo, ip } = request.body

  if (!email)
    return APIError(
      response,
      HttpStatus.INVALID_REQUEST,
      "Missing 'Email' field in request"
    )

  if (!otp)
    return APIError(
      response,
      HttpStatus.INVALID_REQUEST,
      "Missing -'OTP' field inside response"
    )

  const user = await UserService.validateUserByEmail(email)

  if (!user) {
    return APIError(
      response,
      HttpStatus.INVALID_REQUEST,
      "This email address doesn't exists"
    )
  }

  // validate otp
  const validOTP = await OtpService.validateOTP(response, email, otp)

  // Check if OTP entered is the same
  if (!validOTP.matched) {
    await UserService.updateUserProfile(user)
    await LogService.createLog(ip, deviceInfo, 'Failed')

    return APIError(
      response,
      HttpStatus.INVALID_REQUEST,
      "You entered incorrect 'OTP'"
    )
  }

  // lock profile when loginAttempts is >= 5
  if (user.loginAttempts >= 5) {
    await UserService.lockUserProfile(response, user, ip)
  }

  // Reset login attempts on successful OTP verification
  const verified = await AuthService.verifyOTP(
    user,
    deviceInfo,
    ip,
    validOTP.userOtp
  )

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
