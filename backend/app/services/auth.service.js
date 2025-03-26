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
    const userOtp = await OtpService.creatOtp(email);
    // send otp to user email
    if (userOtp) {
      const emailText = `An OTP with a 6-digit code: ${userOtp}`
      await EmailService.sendEmail(email, emailText)
    }
  }

  async verifyOTP(user, deviceInfo, ip, otpId) {
    // Reset login attempts on successful OTP verification
    await UserService.resetUserProfile(user)

    // Delete OTP after successful verification
    await OtpService.deleteOTP(otpId)

    // CREATE LOGS
    await LogService.createLog(ip, deviceInfo, 'Success')
  }
}

export const AuthService = new Service()
