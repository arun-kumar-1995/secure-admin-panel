import jwt from 'jsonwebtoken'

export const generateToken = async (ip) => {
  const token = jwt.sign({ ip }, process.env.JWT_SECRET, { expiresIn: '1h' })
  return token
}
