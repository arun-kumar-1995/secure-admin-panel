import { HttpStatus } from '../constants/httpStatus.constants.js'
import { APIError } from '../shared/errorHandler.shared.js'

export const validate = (body, fields) => {
  const errors = []
  for (const field of Object.keys(fields)) {
    if (!body[field]) {
      errors.push(`'${field}'`)
    }
  }
  if (errors.length > 0) {
    const message = `Missing required field: ${errors.join(' & ')}`
    throw new APIError(HttpStatus.INVALID_REQUEST, message)
  }
}
