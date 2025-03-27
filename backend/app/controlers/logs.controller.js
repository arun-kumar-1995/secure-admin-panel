import { HttpStatus } from '../constants/httpStatus.constants.js'
import { LogModel } from '../models/logs.models.js'
import { APIResponse } from '../shared/apiResponse.shared.js'
import { CatchAsyncError } from '../shared/catchAsyncError.shared.js'

export const getAccessLogs = CatchAsyncError(
  async (request, response, next) => {
    const logs = await LogModel.find({});

    return APIResponse(
      response,
      HttpStatus.SUCCESS,
      'Here are the access logs',
      { logs }
    )
  }
)
