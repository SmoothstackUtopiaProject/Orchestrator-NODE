const Firebase = require("./Firebase");
const Logger = require("../utils/Logger");
const Store = require("../Store");

const LogIndicator = String(`[FIREBASE-CLOUDLOGS]`);

class FirebaseCloudLogs {

  static initialize() {
    const { environment } = Store.getState();
    const path = String(`Logs/Instances/${environment.deployment}`);
    const payload = {
      applicationName: environment.applicationName,
      timestamp: Date.now(),
      version: environment.version,
    };
    Firebase.saveUnique(path, payload,
      (err2) => Logger.error(`${LogIndicator} failed to initialize.\n${err2}`),
      (uniqueId) => {
        Logger.subscribe((message) => FirebaseCloudLogs.post(message));
        Logger.info(`${LogIndicator} initialized with ID: "${uniqueId}".`);
        Store.setState((state) => ({ environment: { ...state.environment, cloudInstanceId: uniqueId }}));
      }
    );
  }

  static post(message) {
    const { environment } = Store.getState();
    if(environment.cloudInstanceId && !message.includes(LogIndicator)) {
      const path = String(`Logs/${environment.deployment}/${environment.applicationName}`);
      const payload = {
        message,
        authorId: environment.cloudInstanceId,
        timestamp: Date.now(),
      };
      Firebase.saveUnique(path, payload,
        (err) => Logger.error(`${LogIndicator} failed to post a log.\nMessage: ${message}\nError: ${err}`),
        () => {/* success, do nothing */}
      );
    }
  }
}
module.exports = FirebaseCloudLogs;
