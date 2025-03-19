import dotenv from 'dotenv'
import path from 'path'

import { getFilePaths } from '../app/shared/fileUtils.shared.js'
const { __filename, __dirname } = getFilePaths(import.meta.url)

;(() => {
  try {
    const envFilePath = path.resolve(
      __dirname,
      `./.env.${process.env.NODE_ENV}`
    )
    const { error } = dotenv.config({
      path: envFilePath,
      debug: process.env.ENABLE_DEBUG,
    })

    // handle error
    if (error) {
      throw new Error(
        `Failed to load env file for ${process.env.NODE_ENV}\n ${error}`
      )
    }
    // console.log("Environment variables loaded");
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }
})()
