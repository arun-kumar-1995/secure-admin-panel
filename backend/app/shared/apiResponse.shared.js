export const ApiResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    status: statusCode,
    ...(data && { data }),
  })
}

export const APIResponse = (res, http, message, data = null) => {
  const { statusCode, code } = http

  // * handle exceptions
  if (!message) throw new Error("Missing required parameter - 'message'")

  res.status(statusCode).json({
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
