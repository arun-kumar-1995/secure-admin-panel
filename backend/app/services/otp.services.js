/**
 * Import required modules
 * */

import { HttpStatus } from '../constants/httpStatus.constants.js'
import { OtpModel } from '../models/otp.models.js'
import { APIError } from '../shared/errorHandler.shared.js'
import { GenerateOtp } from '../helpers/generateOtp.helpers.js'
/**
 * Define OTP Class
 *
 * This class holds the otp services layer
 **/

class Otp {
  async creatOtp(email) {
    // get 6 digit otp
    const otp = GenerateOtp()
    // create otp document
    const userOtp = await OtpModel.create({ email, otp })

    if (!userOtp)
      throw new APIError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error creating user otp'
      )

    return userOtp.otp
  }

  async validateOTP(userEmail, userOtp) {
    const validOtp = await OtpModel.findOne({ email: userEmail})
    if (!validOtp)
      throw new APIError(
        HttpStatus.INVALID_REQUEST,
        'You entered Invalid or expired OTP'
      )

    return {
      matched: userOtp === validOtp.otp,
      otpId: validOtp._id,
    }
  }

  async deleteOTP(otpId) {
    await OtpModel.deleteOne({ _id: otpId })
  }
}

/**
 * Export otp class as singleton module
 */
export const OtpService = new Otp()
