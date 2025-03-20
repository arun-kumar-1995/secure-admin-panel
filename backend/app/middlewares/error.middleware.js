export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let errorMessage = err.message || 'Internal Server Error'

  //reference error
  if (err instanceof ReferenceError) {
    statusCode = 400
  }

  // MongoDB connection errors
  if (err.name === 'MongoNetworkError') {
    statusCode = 503
    errorMessage = 'Unable to connect to the database. Please try again later.'
  }
  // duplicate key error
  if (err.code === 11000) {
    statusCode = 400
    const field = Object.keys(err.keyValue)[0]
    errorMessage = `Duplicate value for ${field}. Please use a different value.`
  }

  // validation error
  if (err.name === 'ValidationError') {
    const fieldNames = Object.values(err.errors).map((err) => err.path)
    errorMessage = `${fieldNames.join(', ')} is required.`
  }

  // return the json response
  return res.status(statusCode).json({
    success: false,
    message: errorMessage,
    status: statusCode,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  })
}
