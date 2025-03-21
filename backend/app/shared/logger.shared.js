import chalk from 'chalk'

class Logger {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production'
  }

  formatMessage(level, message) {
    return `======== ${[level]} ======== \n${message}`
  }

  print(color, message, level) {
    console[level.toLowerCase()](
      chalk[color](this.formatMessage(level, message))
    )
  }

  info(message) {
    this.print('green', message, 'INFO')
  }

  warn(message) {
    this.print('yellow', message, 'WARM')
  }
  error(message) {
    this.print('red', message, 'ERROR')
  }
  debug(message, errorStack = null) {
    if (errorStack && !this.isProduction)
      message = `${message} \n ERROR STACK: ${errorStack}`
    this.print('cyan', message, 'DEBUG')
  }
}

export default new Logger()
