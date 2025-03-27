import { HttpStatus } from '../constants/httpStatus.constants.js'
import { BlockIPModel } from '../models/blockIPs.models.js'
import { APIError } from '../shared/errorHandler.shared.js'
import { EmailService } from './email.services.js'
import { LogService } from './logs.service.js'
import { OtpService } from './otp.services.js'
import { UserService } from './user.services.js'
class Service {
  async #createLogAndError(staticIP, deviceInfo) {
    // CREATE LOGS
    await LogService.createLog(staticIP, deviceInfo, 'Failed')
    // throw error
    throw new APIError(
      HttpStatus.INVALID_REQUEST,
      "You entered and Invalid 'IP Address'"
    )
  }

  async requestOTP(email) {
    // validate incoming user with email
    await UserService.validateUserByEmail(email)

    // if valid email create an otp
    const userOtp = await OtpService.creatOtp(email)
    // send otp to user email
    if (userOtp) {
      const emailText = `An OTP with a 6-digit code: ${userOtp}`
      await EmailService.sendEmail(email, emailText)
    }
  }

  async verifyOTP({ email, deviceInfo, ip, otp }) {
    // validate incoming user with email
    const user = await UserService.validateUserByEmail(email)

    // validate user otp
    const validOTP = await OtpService.validateOTP(email, otp)

    // Check if OTP entered is the same
    if (!validOTP.matched && user.loginAttempts < 5) {
      await UserService.updateLoginAttempts(user)
      await LogService.createLog(ip, deviceInfo, 'Failed')

      throw new APIError(
        HttpStatus.INVALID_REQUEST,
        "You entered incorrect 'OTP'"
      )
    }

    // lock profile when loginAttempts is >= 5
    if (!validOTP.matched && user.loginAttempts >= 5) {
      await LogService.createLog(ip, deviceInfo, 'Locked')
      await UserService.lockUserProfile(user, ip)
    }

    // Reset login attempts on successful OTP verification
    await UserService.resetUserProfile(user)

    // Delete OTP after successful verification
    await OtpService.deleteOTP(validOTP.otpId)

    // CREATE LOGS
    await LogService.createLog(ip, deviceInfo, 'Success')
  }

  async iPLogin({ staticIP, deviceInfo }) {
    // find user through staticIp entered
    const user = await UserService.findUserByIP(staticIP)
    if (!user) {
      await this.#createLogAndError(staticIP, deviceInfo)
    }

    // Create Logs for successfull login
    await LogService.createLog(staticIP, deviceInfo, 'Success')
  }

  async blockIPs(ipAdrr) {
    // find the ip address schema
    let isBlocked = await BlockIPModel.findOne(ipAdrr)

    if (isBlocked)
      throw new APIError(
        HttpStatus.SUCCESS,
        `IP Address:- ${ipAdrr} is successfully blocked.`
      )

    // block ip
    await BlockIPModel.createBlockIP(ipAdrr)
  }
}

export const AuthService = new Service()
