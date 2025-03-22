'use strict'

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

export const OTP = model('OTP', schema)
