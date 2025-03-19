import mongoose from 'mongoose'

const schema = new mongoose.Schema(
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

export const OTP = mongoose.model('OTP', schema)
