/**
 *  Import required modules
 */

import { HttpStatus } from '../constants/httpStatus.constants.js'
import { UserModal } from '../models/user.models.js'
import { APIError } from '../shared/errorHandler.shared.js'

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

  async registerUser(response, newUser) {
    const duplicate = await UserModal.findUserByEmail(newUser.email)
    if (duplicate)
      return APIError(response, HttpStatus.CONFLICT, 'Email already registered')
    return await UserModal.createUser(newUser)
  }

  async validateUserByEmail(email) {
    return await UserModal.findUserByEmail(email);
  }
}

/**
 * import user service class as a singleton
 */
export const UserService = new Service()
