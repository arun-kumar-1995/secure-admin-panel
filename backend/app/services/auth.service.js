import { AsyncWrapper } from '../helpers/asyncWrapper.helpers.js'
import { LogService } from './logs.service.js'
import { OtpService } from './otp.services.js'
import { UserService } from './user.services.js'

class Service {
  async verifyOTP(user, deviceInfo, ip, otpId) {
    // Reset login attempts on successful OTP verification
    await UserService.resetUserProfile(user)

    // Delete OTP after successful verification
    await OtpService.deleteOTP(otpId);

    // CREATE LOGS
    await LogService.createLog(ip, deviceInfo, 'Success');
  }
}

export const AuthService = new Service()
