import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    userId: {
      ref: 'User',
      required: true,
    },
    ip: {
      type: String,
      required: [true, 'Ip address is required'],
    },
    deviceInfo: {
      type: String,
      required: [true, 'Device info is required'],
    },
    status: {
      type: Boolean,
    },
  },
  { timestamps: true }
)
export const Logs = mongoose.model('Logs', schema)
