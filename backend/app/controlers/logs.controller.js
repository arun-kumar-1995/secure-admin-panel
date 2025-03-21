import { HttpStatus } from '../constants/httpStatus.constants.js'
import { Logs } from '../schemas/logs.schemas.js'
import { APIResponse } from '../shared/apiResponse.shared.js'
import { CatchAsyncError } from '../shared/catchAsyncError.shared.js'

export const getAccessLogs = CatchAsyncError(async (req, res, next) => {
  const logs = await Logs.find().sort({ _id: -1 })
  
  return APIResponse(res, HttpStatus.SUCCESS, 'Here are the access logs', { logs })
})
