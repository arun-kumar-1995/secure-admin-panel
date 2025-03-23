'use strict'
/**
 *  import required module
 */

import { Schema, model } from 'mongoose'

const schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    otp: {
      type: String,
      required: [true, 'Otp number is required'],
    },
    createdAt: {
      type: Date,
      expires: 720,
      default: Date.now,
    },
  },
  { timestamps: true }
)

/**
 *  Export model
 **/

export const OTP = model('OTP', schema)
