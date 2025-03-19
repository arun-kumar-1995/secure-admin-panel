import mongoose from 'mongoose'
const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
    },
    staticIP: {
      type: String,
      default: null,
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
