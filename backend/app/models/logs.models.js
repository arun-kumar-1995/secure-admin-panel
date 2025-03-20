import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: [true, 'Ip address is required'],
    },
    deviceInfo: {
      type: String,
      required: [true, 'Device info is required'],
    },
    status: {
      type: String,
      enum: ['Success', 'Failed'],
    },
  },
  { timestamps: true }
)
export const Logs = mongoose.model('Logs', schema)
