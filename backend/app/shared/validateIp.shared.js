export const isValidLocalIP = (ip) => {
  const localIPRegex =
    /^(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})$/
  return localIPRegex.test(ip)
}
