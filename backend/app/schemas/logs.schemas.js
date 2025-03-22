'use strict';

import { Schema , model } from 'mongoose'

const schema = new Schema(
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
      enum: ['Success', 'Failed', 'Blocked'],
    },
  },
  { timestamps: true }
)

export const Logs = model('Log', schema);