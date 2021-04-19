const _ = require("lodash");
const colors = require("colors");
const Constants = require("../resources/Constants.json");
const LogIndicator = String(`-=[Logger]=-`);

class Logger {
  // State Variables
  static applicationId = "";
  static isDebugActive = true;
  static isErrorActive = true;
  static isInfoActive = true;
  static isWarnActive = true;
  static listeners = {};

  // Color Variables
  static debugStyle = colors.cyan;
  static errorStyle = colors.bgRed.white;
  static infoStyle = colors.green;
  static warnStyle = colors.bgYellow.white;

  static publish(message) {
    const listenerKeys = Object.keys(Logger.listeners);
    for(const i in listenerKeys) {
      if(Logger.listeners[listenerKeys[i]]) {
        Logger.listeners[listenerKeys[i]](message);
      }
      else {
        Logger.unsubscribe(listenerKeys[i]);
      }
    }
  }

  static subscribe(listener) {
    const key = _.uniqueId("LoggerListener-");
    Logger.listeners[key] = listener;
  }

  static unsubscribe(key) {
    _.omit(Logger.listeners, key);
  }

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
    Logger.info(`${LogIndicator} config: "${environment}".`);
  }

  static debug(message) {
    if (this.isDebugActive) {
      const formattedMessage = String(`[DEBUG]: ${message}`);
      Logger.publish(formattedMessage);
      console.debug(Logger.debugStyle(formattedMessage));
    }
  }

  static error(message) {
    if (this.isErrorActive) {
      const formattedMessage = String(`[ERROR]: ${message}`);
      Logger.publish(formattedMessage);
      console.error(Logger.errorStyle(formattedMessage));
    }
  }

  static info(message) {
    if (this.isInfoActive) {
      const formattedMessage = String(`[INFO]: ${message}`);
      Logger.publish(formattedMessage);
      console.info(Logger.infoStyle(formattedMessage));
    }
  }

  static warn(message) {
    if (this.isWarnActive) {
      const formattedMessage = String(`[WARN]: ${message}`);
      Logger.publish(formattedMessage);
      console.warn(Logger.warnStyle(formattedMessage));
    }
  }
}
module.exports = Logger;
