import mongoose from 'mongoose'
const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    staticIP: {
      type: String,
      default: null,
      trim: true,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    accountStatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export const User = mongoose.model('User', schema)
