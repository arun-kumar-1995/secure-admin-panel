'use strict'

/**
 * Base Model Class
 *
 * This class provides a generic interface for interacting with a Mongoose model.
 * It includes common database operations such as find, create, update, and delete.
 *
 * Usage:
 * Extend this class in specific model services to ensure reusability and maintain
 * consistency in database interactions.
 */

class Model {
  /**
   * Constructor to initialize the model instance
   * @param {Object} model - Mongoose model to be used for database operations
   */
  constructor(model) {
    this.model = model
  }

  // ==========================
  //  Database Query Methods 
  // ==========================

  /**
   * Find a document by its ID
   * @param {string} id - The unique identifier of the document
   * @returns {Promise<Object|null>} - The found document or null if not found
   */
  async findById(id) {
    return await this.model.findById(id)
  }

  /**
   * Find a single document that matches the query
   * @param {Object} query - The search query object
   * @returns {Promise<Object|null>} - The found document or null if not found
   */
  async findOne(query) {
    return await this.model.findOne(query)
  }

  /**
   * Find multiple documents that match the query
   * @param {Object} query - The search query object
   * @returns {Promise<Array>} - An array of matched documents
   */
  async find(query) {
    return await this.model.find(query)
  }

  /**
   * Create a new document in the database
   * @param {Object} data - The data object to create a new document
   * @returns {Promise<Object>} - The created document
   */
  async create(data) {
    return await this.model.create(data);
  }

  /**
   * Update a single document that matches the query
   * @param {Object} query - The search query to find the document
   * @param {Object} data - The update data object
   * @returns {Promise<Object>} - The update result (acknowledgment)
   */
  async update(query, data) {
    return await this.model.updateOne(query, data)
  }

  /**
   * Delete a single document that matches the query
   * @param {Object} query - The search query to find the document
   * @returns {Promise<Object>} - The deletion result (acknowledgment)
   */
  async deleteOne(query) {
    return await this.model.deleteOne(query)
  }

  /**
   * Perform an aggregation query on the collection
   * @param {Array} pipeline - The aggregation pipeline array
   * @returns {Promise<Array>} - The aggregation results
   */
  async aggregate(pipeline) {
    return await this.model.aggregate(pipeline)
  }
}

export { Model }
