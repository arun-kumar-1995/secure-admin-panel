import { UAParser } from "ua-parser-js";

export const getDeviceInfo = () => {
  const parser = new UAParser();
  const result = parser.getResult();

  return result.device.type || result.browser.name;
};
