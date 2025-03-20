import mongoose from 'mongoose'
const schema = new mongoose.Schema(
  {
    blockedIps: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

export const IpBlocked = mongoose.model('IpBlocked', schema)
