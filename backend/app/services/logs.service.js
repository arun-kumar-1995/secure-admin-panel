'use strict'

/**
 * Import required module
 */

import { LogModel } from '../models/logs.models.js'
/**
 *  Class Log service holds all the methods associated with Log model
 */

class Service {
  async createLog(ipAddress, deviceInfo, status) {
    await LogModel.create(ipAddress, deviceInfo, status);
  }
}

/**
 *  Export log service as singleton
*/
export const LogService = new Service()
