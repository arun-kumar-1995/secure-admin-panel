export const ErrorHandler = (res, statusCode, message) => {
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  })
}
export const APIError = (req, res, http, message) => {
  const { statusCode, code } = http

  // * handle exceptions
  if (!message) throw new Error("Missing required parameter - 'message'");

  // * Error response object
  const errorResponse = {
    success: false,
    code,
    statusCode,
    message: message || 'An error has occurred',
    path: req.originalUrl || 'Unknown path',
    errors: [
      {
        message,
        domain: req.hostname,
      },
    ],
    meta: {
      timestamp: new Date().toISOString(),
      requestId: '', // user ID or IP address
    },
  }
  res.status(statusCode).json({ error: errorResponse })
}
