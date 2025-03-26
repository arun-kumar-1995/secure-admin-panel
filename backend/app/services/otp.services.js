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
    const otp = GenerateOtp();
    // create otp document
    const userOtp = await OtpModel.create({ email, otp })

    if (!userOtp)
      throw new APIError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error creating user otp'
      )

    return userOtp.otp;
  }

  async #findOTP(userEmail, userOtp) {
    return await OtpModel.findOne({ email: userEmail, otp: userOtp })
  }

  async validateOTP(response, userEmail, userOtp) {
    const validOtp = await this.#findOTP(userEmail, userOtp)
    if (!validOtp)
      return APIError(
        response,
        HttpStatus.INVALID_REQUEST,
        'You entered Invalid or expired OTP'
      )

    return {
      matched: userOtp === valid.otp,
      userOtp: validOtp._id,
    }
  }

  async deleteOTP(otpID) {
    await OtpModel.deleteOne({ _id: otpID })
  }
}

/**
 * Export otp class as singleton module
 */
export const OtpService = new Otp()
