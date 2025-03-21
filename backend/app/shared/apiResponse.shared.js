export const ApiResponse = (response, statusCode, message, data = null) => {
  response.status(statusCode).json({
    success: true,
    message,
    status: statusCode,
    ...(data && { data }),
  })
}

export const APIResponse = (response, http, message, data = null) => {
  const { statusCode, code } = http

  // * handle exceptions
  if (!message) throw new Error("Missing required parameter - 'message'")

  response.status(statusCode).json({
    success: true,
    statusCode,
    message,
    ...(data && { data }),
    meta: {
      timestamp: new Date().toISOString(),
      requestId: '',
    },
  })
}
