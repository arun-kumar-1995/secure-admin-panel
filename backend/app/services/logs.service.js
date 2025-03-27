'use strict'

/**
 * Import required module
 */

import { LogModel } from '../models/logs.models.js'
/**
 *  Class Log service holds all the methods associated with Log model
 */

class Service {
  async createLog(ip, deviceInfo, status) {
    await LogModel.create(ip, deviceInfo, status)
  }
}

/**
 *  Export log service as singleton
 */
export const LogService = new Service()
