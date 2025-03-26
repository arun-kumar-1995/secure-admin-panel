import { CatchAsyncError } from '../shared/catchAsyncError.shared.js'
import { APIResponse } from '../shared/apiResponse.shared.js'
import { UserModel } from '../models/user.models.js'
import { OTP } from '../schemas/otp.schemas.js'
import { APIError, ErrorHandler } from '../shared/errorHandler.shared.js'
import { sendEmail } from '../shared/sendEmail.shared.js'
import { getLocalIP } from '../shared/getLocalIp.shared.js'
import { LogModel } from '../models/logs.models.js'
import { isValidLocalIP } from '../shared/validateIp.shared.js'
import { IpBlocked } from '../models/blokedIps.models.js'
import { GenerateToken } from '../shared/generateToken.shared.js'
import { SendToken } from '../shared/sendToken.Shared.js'
import { sendEmailToAdmin } from '../shared/sendEmailToAdmin.shared.js'
import { HttpStatus } from '../constants/httpStatus.constants.js'
import { UserService } from '../services/user.services.js'
// import { validate } from '../shared/validation.shared.js'
import { OtpService } from '../services/otp.services.js'
import { EmailService } from '../services/email.services.js'
import { LogService } from '../services/logs.service.js'
import { AuthService } from '../services/auth.service.js'
import { validate } from '../helpers/validate.helpers.js'

export const getLocalIp = CatchAsyncError(async (request, response, next) => {
  const ip = getLocalIP()
  APIResponse(response, 200, 'Client Local Ip', { ip })
})

export const register = CatchAsyncError(async (request, response, next) => {
  const { email } = request.body
  validate(request.body, { email })

  const user = await UserService.registerUser(request.body)
  return APIResponse(response, HttpStatus.SUCCESS, 'User registered', { user })
})

export const requestOtp = CatchAsyncError(async (request, response, next) => {
  const { email } = request.body
  validate(request.body, { email })

  await AuthService.requestOTP(email)
  // send response
  return APIResponse(
    response,
    HttpStatus.SUCCESS,
    `An otp is send to email ${email} for verification`
  )
})

export const verifyOtp = CatchAsyncError(async (request, response, next) => {
  const { email, otp, deviceInfo, ip } = request.body
  // validate request parameters
  validate(request.body, { email, otp, deviceInfo, ip })

  await AuthService.verifyOTP(request.body)

  // Generate token
  const token = GenerateToken(email)

  // Send token inside cookie
  SendToken(response, token, 'OTP verified successfully')
})

export const ipLogin = CatchAsyncError(async (request, response, next) => {
  const { staticIP, deviceInfo } = request.body

  // validate incoming parameter
  validate(request.body, { staticIP, deviceInfo })

  await AuthService.iPLogin(request.body)

  // generate token based on static ip
  const token = GenerateToken(staticIP)

  // send token in cookie
  SendToken(response, token, 'You are logged in');
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
