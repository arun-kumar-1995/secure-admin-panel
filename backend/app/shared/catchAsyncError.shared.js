import mongoose from 'mongoose'

export const CatchAsyncError = (controller) => async (req, res, next) => {
  try {
    //catch async error and pass to next middleware
    await Promise.resolve(controller(req, res, next))
  } catch (err) {
    return next(err)
  }
}
