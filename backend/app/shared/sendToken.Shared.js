export const SendToken = (res, token, message) => {
  return res
    .status(200)
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: parseInt(process.env.TOKEN_EXPIRE, 10) * 60 * 1000,
      sameSite: 'strict',
    })
    .json({
      success: true,
      message,
      token,
    })
}
