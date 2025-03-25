import { APIError } from '../shared/errorHandler.shared.js'

export const errorMiddleware = (error, request, response, next) => {
  let statusCode = error.statusCode || 500
  let errorMessage = error.message || 'Internal Server Error'
  let code = error.code || 'InternalServerError'

  if (error instanceof APIError) {
    code = error.code
  }
  //reference error
  if (error instanceof ReferenceError) {
    statusCode = 400
  }

  // MongoDB connection errors
  if (error.name === 'MongoNetworkError') {
    statusCode = 503
    errorMessage = 'Unable to connect to the database. Please try again later.'
  }
  // duplicate key error
  if (error.code === 11000) {
    statusCode = 400
    const field = Object.keys(error.keyValue)[0]
    errorMessage = `Duplicate value for ${field}. Please use a different value.`
  }

  // validation error
  if (error.name === 'ValidationError') {
    const fieldNames = Object.values(error.errors).map((error) => error.path)
    errorMessage = `${fieldNames.join(', ')} is required.`
  }

  const errorResponse = {
    success: false,
    code,
    statusCode,
    message: errorMessage || 'An error has occurred',
    meta: {
      timestamp: new Date().toISOString(),
      domain: 'localhost',
      // requestId: '', // user ID or IP address
    },
    // ErrorStack:
    // process.env.NODE_ENV === 'development' ? error.stack : undefined,
  }
  // return the json response
  return response.status(statusCode).json({ error: errorResponse })
}
