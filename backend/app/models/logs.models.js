import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    userId: {
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)
export const Logs = mongoose.model('Logs', schema)
