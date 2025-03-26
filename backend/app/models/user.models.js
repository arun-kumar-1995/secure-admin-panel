'use strict'

/**
 *  Import required modules
 * */
import { User } from '../schemas/user.schemas.js'
import { Model } from '../helpers/baseModel.helpers.js'

/**
 * UserModel Class
 *
 * This class extends the base `Model` class, providing additional
 * user-specific utility functions to interact with the database.
 *
 * It ensures consistency and reusability across different models
 * while allowing for specific user-related queries.
 */

class UserModal extends Model {
  /**
   * Constructor for UserModel
   *
   * Calls the parent `Model` constructor, passing the `User` model.
   * This ensures that the base model functionalities are inherited.
   *
   * @param {Object} userModel - Mongoose model for the User collection
   */
  constructor(userModel) {
    super(userModel)
    this.User = userModel
  }

  // ==========================
  //  User-Specific Methods
  // ==========================

  /**
   * Find a user by email
   *
   * @param {string} email - The email of the user to find
   * @returns {Promise<Object|null>} - Returns the user document or null if not found
   */
  async findOne(params) {
    return await this.User.findOne(params)
  }

  async findById(id) {
    return await this.User.findById(id)
  }

  /**
   * Create a new user
   *
   * @param {Object} body - The user data to create a new user document
   * @returns {Promise<Object>} - Returns the created user document
   */
  async createUser(body) {
    return await this.User.create(body)
  }
}

/**
 * Export an instance of the UserModel to be used across the application
 */
export const UserModel = new UserModal(User)
