'use strict';

import { OTP } from '../schemas/otp.schemas.js'

//  * otp data layer
export const OtpStatics = {
  // * Get OTP by email
  async getOtpByEmail(email) {
    const otp = await OTP.findOne({ email }).populate('user', 'email')
    if (!otp) {
      throw new ErrorHandler(404, 'No OTP found for this email')
    }
    return otp
  },
}
