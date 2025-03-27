/**
 *  Import required modules
 */

import { HttpStatus } from '../constants/httpStatus.constants.js'
import { UserModel } from '../models/user.models.js'
import { APIError } from '../shared/errorHandler.shared.js'
import { EmailService } from './email.services.js'

/**
 * User Service class
 *
 * This class holds the user services layer
 */

class Service {
  /**
   * inside this class we define user services
   */
  // ========================== //
  //  User Specified Services
  // ========================== //

  /**
   *  Registers a new user
   * @param {Object} response - Express response object used to send API errors.
   * @param {Object} newUser - User data containing required registration details.
   * @throw {APIError} APIError - throws APIError when email is already registered
   * @returns{Promise <Object|Void>} - Returns the created user object if registration is successful
   */

  async registerUser(newUser) {
    const duplicate = await UserModel.findOne({ email: newUser.email })
    if (duplicate)
      throw new APIError(
        HttpStatus.CONFLICT,
        "This 'Email' is already registered"
      )
    return await UserModel.createUser(newUser);
  }

  async validateUserByEmail(email) {
    const user = await UserModel.findOne({ email });
    if (!user)
      throw new APIError(
        HttpStatus.NOT_FOUND,
        `Email:'${email}' is not registered`
      )

    return user
  }

  async findUserByIP(staticIP) {
    const user = await UserModel.findOne({ staticIP });
    return user
  }
  async resetUserProfile(user) {
    user.loginAttempts = 0
    await user.save()
  }

  async updateLoginAttempts(user) {
    user.loginAttempts += 1
    await user.save()
  }

  async lockUserProfile(user, ip) {
    user.accountStatus = 'Locked'
    await user.save()

    // Send email to admin
    const emailText = `An user with IP Address ${ip} is trying to access the route`
    await EmailService.notifyAdmin(emailText);
    throw new APIError(HttpStatus.FORBIDDEN, 'Your account has been locked')
  }
}

/**
 * import user service class as a singleton
 */
export const UserService = new Service()
