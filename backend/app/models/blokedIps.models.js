'use strict'

import {Schema , model } from 'mongoose';

const schema = new Schema(
  {
    blockedIps: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

export const IpBlocked = model('IpBlocked', schema)
