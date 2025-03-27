import { CatchAsyncError } from '../shared/catchAsyncError.shared.js'
import { APIResponse } from '../shared/apiResponse.shared.js'
import { getLocalIP } from '../shared/getLocalIp.shared.js'
import { GenerateToken } from '../shared/generateToken.shared.js'
import { SendToken } from '../shared/sendToken.Shared.js'
import { HttpStatus } from '../constants/httpStatus.constants.js'
import { UserService } from '../services/user.services.js'
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
    `An otp is send to Email:- '${email}' for verification`
  )
})

export const verifyOtp = CatchAsyncError(async (request, response, next) => {
  const { email, otp, deviceInfo, ip } = request.body
  // validate request parameters
  validate(request.body, { email, otp, deviceInfo, ip })

  await AuthService.verifyOTP(request.body)

  // Generate token
  const token = await GenerateToken(email)

  // Send token inside cookie
  SendToken(response, token, 'OTP verified successfully')
})

export const ipLogin = CatchAsyncError(async (request, response, next) => {
  const { staticIP, deviceInfo } = request.body

  // validate incoming parameter
  validate(request.body, { staticIP, deviceInfo })

  await AuthService.iPLogin(request.body)

  // generate token based on static ip
  const token = await GenerateToken(staticIP)

  // send token in cookie
  SendToken(response, token, 'You are logged in')
})

export const blockIpAddress = CatchAsyncError(
  async (request, response, next) => {
    const { ip } = request.body
    validate(request.body, { ip })

    await AuthService.blockIPs(ip)

    return APIResponse(
      response,
      HttpStatus.SUCCESS,
      `IP Address:- ${ipAdrr} is successfully blocked.`
    )
  }
)
