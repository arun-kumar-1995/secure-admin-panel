export const ErrorHandler = (res, statusCode, message) => {
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  })
}
