const colors = require("colors");
const Constants = require("../resources/Constants.json");

class Logger {
  static isDebugActive = true;
  static isErrorActive = true;
  static isInfoActive = true;
  static isWarnActive = true;

  static initialize(logLevel) {
    let environment = Constants.environments.production;
    switch (logLevel) {

      // Development
      case Constants.environments.development:
        environment = Constants.environments.development;
        this.isDebugActive = true;
        this.isErrorActive = true;
        this.isInfoActive = true;
        this.isWarnActive = true;
        break;

      // Testing
      case Constants.environments.testing:
        environment = Constants.environments.testing;
        this.isDebugActive = false;
        this.isErrorActive = true;
        this.isInfoActive = false;
        this.isWarnActive = true;
        break;

      // Production - prod (!dev && !test)
      default:
        this.isDebugActive = false;
        this.isErrorActive = true;
        this.isInfoActive = true;
        this.isWarnActive = true;
    }
    Logger.info(`-=[Logger]=- config: "${environment}"`);
  }

  static debug(message) {
    if (this.isDebugActive) {
      console.debug(`[DEBUG]: ${message}`.cyan);
    }
  }

  static error(message) {
    if (this.isErrorActive) {
      console.error(`[ERROR]: ${message}`.bgRed.white);
    }
  }

  static info(message) {
    if (this.isInfoActive) {
      console.info(`[INFO]: ${message}`.green);
    }
  }

  static warn(message) {
    if (this.isWarnActive) {
      console.warn(`[WARN]: ${message}`.bgYellow.white);
    }
  }
}
module.exports = Logger;
