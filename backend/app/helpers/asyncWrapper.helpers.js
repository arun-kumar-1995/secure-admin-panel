import { HttpStatus } from '../constants/httpStatus.constants.js'

export const AsyncWrapper = (wrapperFunc) => async (params) => {
  try {
    await wrapperFunc(params)
  } catch (err) {
    return APIError(HttpStatus.INTERNAL_SERVER_ERROR, err.message)
  }
}
