export const handleAppRouting = async (ip) => {
  console.log(ip);

  const isLocalNetwork =
    /^192\.168\.\d{1,3}\.\d{1,3}$|^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip);
  return isLocalNetwork ? "/" : `/access-denied/${ip}`;
};
