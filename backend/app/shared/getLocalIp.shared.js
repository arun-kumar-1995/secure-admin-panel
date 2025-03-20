import os from 'os'
export const getLocalIP = () => {
  const networkInterfaces = os.networkInterfaces()

  for (const interfaceName in networkInterfaces) {
    for (const net of networkInterfaces[interfaceName]) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`Local Network IP: ${net.address}`)
        return net.address // Return first found local IP
      }
    }
  }
  return null
}
