'use strict'

import { User } from '../schemas/user.schemas.js'

// * User statics
export const UserStatics = {
  async findUserByEmail(email) {
    return await User.findOne({ email })
  },

  async createUser(body) {
    return await User.create(body)
  },
}
