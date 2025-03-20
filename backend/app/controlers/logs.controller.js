import { Logs } from '../models/logs.models.js'
import { ApiResponse } from '../shared/apiResponse.shared.js'
import { CatchAsyncError } from '../shared/catchAsyncError.shared.js'

export const getAccessLogs = CatchAsyncError(async (req, res, next) => {
  const logs = await Logs.find().sort({ _id: -1 })
  ApiResponse(res, 200, 'Here are the access logs', { logs })
})
