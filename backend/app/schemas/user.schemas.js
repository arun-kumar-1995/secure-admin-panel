import mongoose from 'mongoose'
export const UserSchema = new mongoose.Schema(
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
