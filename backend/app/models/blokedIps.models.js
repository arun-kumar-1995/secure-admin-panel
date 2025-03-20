import mongoose from 'mongoose'
const schema = new mongoose.Schema(
  {
    ip: {
      type: String,
    },
  },
  { timestamps: true }
)

export const IpBlocked = mongoose.model('IpBlocked', schema)
