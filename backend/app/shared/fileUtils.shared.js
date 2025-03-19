import { fileURLToPath } from "url";
import path from "path";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const getFilePaths = (metaUrl) => {
  const __filename = fileURLToPath(metaUrl);
  const __dirname = path.dirname(__filename);
  return { __filename, __dirname };
};