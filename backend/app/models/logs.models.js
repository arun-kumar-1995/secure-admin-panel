'use strict'

/**
 *
 * Import required modules
 */
import { Model } from '../helpers/baseModel.helpers.js'
import { Logs } from '../schemas/logs.schemas.js'

/**
 *  Class Log model
 *
 * This class extents base model class , holding Logs related mehods
 */
class LogModal extends Model {
  /**
   *  @constructor {Object} logModel - This class contructor when called will have logModel as an object
   */
  constructor(logModel) {
    super(logModel)
    this.Logs = logModel
  }

  // ====================== //
  // Logs Specified Methods //
  // =====================//

  async create(ip, deviceInfo, status) {
    await this.Logs.create({ ip, deviceInfo, status })
  }

  async find(query) {
    return await this.Logs.find(query).sort({ _id: -1 });
  }
}

/**
 *  Export LogModel as singleton
 */

export const LogModel = new LogModal(Logs)
