'use strict'

/**
 *  Import required modules
 */

import { Model } from '../helpers/baseModel.helpers.js'
import { OTP } from '../schemas/otp.schemas.js'

/**
 * OTP Model class
 *
 * This class extends the base `Model` class, providing additional
 * OTP-specific utility functions to interact with the database.
 */

class OtpModal extends Model {
  /**
   * @constructor {Object} otpModel -  it accepts otp models
   */
  constructor(otpModel) {
    super(otpModel)

    this.Otp = otpModel
  }

  // ==========================
  //  Otp Specific methods
  // ==========================

  async create(props) {
    return await this.Otp.create(props)
  }
  async deleteOne(props) {
    return await this.Otp.deleteOne(props)
  }
  async findOne(props) {
    return await this.Otp.findOne(props)
  }
}

/**
 * Export the opt model as singleton
 */
export const OtpModel = new OtpModal(OTP)
