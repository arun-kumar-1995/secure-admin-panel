/**
 * Import required modules
 * */

import { HttpStatus } from '../constants/httpStatus.constants.js'
import { OtpModel } from '../models/otp.models.js'
import { APIError } from '../shared/errorHandler.shared.js'

/**
 * Define OTP Class
 *
 * This class holds the otp services layer
 **/

class Otp {
  #generateOtp() {
    let otp = ''
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10)
    }
    return otp
  }

  async #saveOTP(params) {
    return await OtpModel.createOtp(params)
  }

  async creatOtp(response, email) {
    if (!email)
      return APIError(
        response,
        HttpStatus.INVALID_REQUEST,
        "Missing 'email' parameter inside createOtp request"
      )

    const otp = this.#generateOtp()

    // save to database
    const userOtp = await this.#saveOTP({ email, otp })

    if (!userOtp)
      return APIError(
        response,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error creating user otp'
      )

    return userOtp.otp
  }
}

/**
 * Export otp class as singleton module
 */
export const OtpService = new Otp()
