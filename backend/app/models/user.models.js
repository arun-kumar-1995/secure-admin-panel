import mongoose from 'mongoose'
import { UserSchema } from '../schemas/user.schemas.js'

UserSchema.statics = {
  async findUserByEmail(email) {
    return await this.findOne({ email })
  },

  async createUser(body) {
    return await this.create(body)
  },
}

export const User = mongoose.model('User', UserSchema)
