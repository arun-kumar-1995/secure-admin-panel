export const ErrorHandler = (response, statusCode, message) => {
  response.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  })
}
export const APIError = (response, http, message) => {
  const { statusCode, code } = http

  // * handle exceptions
  if (!message) throw new Error("Missing required parameter - 'message'")

  // * Error response object
  const errorResponse = {
    success: false,
    code,
    statusCode,
    message: message || 'An error has occurred',
    // path: request.originalUrl || 'Unknown path',
    // errors: [
    //   {
    //     message,
    //     domain: request.hostname,
    //   },
    // ],
    meta: {
      timestamp: new Date().toISOString(),
      domain: 'localhost',
      // requestId: '', // user ID or IP address
    },
  }
  response.status(statusCode).json({ error: errorResponse })
}
