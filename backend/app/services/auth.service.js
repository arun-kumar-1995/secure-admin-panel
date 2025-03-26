import { AsyncWrapper } from '../helpers/asyncWrapper.helpers.js'
import { EmailService } from './email.services.js'
import { LogService } from './logs.service.js'
import { OtpService } from './otp.services.js'
import { UserService } from './user.services.js'

class Service {
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
    const validOTP = await OtpService.validateOTP(email, otp);

    // Check if OTP entered is the same
    if (!validOTP.matched) {
      await UserService.updateUserProfile(user)
      await LogService.createLog(ip, deviceInfo, 'Failed')

      throw new APIError(
        HttpStatus.INVALID_REQUEST,
        "You entered incorrect 'OTP'"
      )
    }

    // lock profile when loginAttempts is >= 5
    if (user.loginAttempts >= 5) {
      await UserService.lockUserProfile(user, ip)
    }

    // Reset login attempts on successful OTP verification
    await UserService.resetUserProfile(user)

    // Delete OTP after successful verification
    await OtpService.deleteOTP(validOTP.otpId)

    // CREATE LOGS
    await LogService.createLog(ip, deviceInfo, 'Success');
  }
}

export const AuthService = new Service()
