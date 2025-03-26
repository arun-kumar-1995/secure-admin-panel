'use strict'

import { Schema, model } from 'mongoose'

const schema = new Schema(
  {
    blockedIP: {
      type: String,
    },
  },
  { timestamps: true }
)

export const IpBlocked = model('IpBlocked', schema)
