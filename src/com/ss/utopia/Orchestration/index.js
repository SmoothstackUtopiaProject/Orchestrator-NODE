const express = require("express");
const Controller = require("../Controller");
const Firebase = require("./Firebase");
const FirebaseCloudLogs = require("./FirebaseCloudLogs");
const Logger = require("../utils/Logger");
const Store = require("../Store");

const app = express();
const Constants = require("../resources/Constants.json");
const startupPollInterval = 1000;
const startupTimeout = 10000;

class Orchestration {

  static initialize() {
    // 1) Environment
    Orchestration.pollEnvironment(startupTimeout);
    Orchestration.initializeEnvironment();
    const { database, environment } = Store.getState();

    // 2) Logger
    Logger.initialize(environment.deployment);
    Logger.info(`[ENVIRONMENT] Application: ${environment.applicationName} v${environment.version}.`);
    Logger.info(`[ENVIRONMENT] initialized with config: "${environment.deployment}".`);

    // 3) Endpoint Listeners
    app.listen(environment.serverPort, () => {
      Logger.info(`[ENVIRONMENT] listening on port: ${environment.serverPort}.`);
      Orchestration.initializeEndpoints();
    });

    // 4) Firebase
    Firebase.initialize(() => {
      Firebase.login(database.username, database.password,
        (err) => Logger.error(`[FIREBASE] failed to authenticate credentials.\n${err}`),
        () => {
          Logger.info(`[FIREBASE] successfully authenticated.`);
          FirebaseCloudLogs.initialize();
        }
      );
    });
  }

  static initializeEnvironment() {
    const args = process.argv;
    for(const i in args) {
      if(args[i]) {
        const [ argName, argValue ] = args[i].split("=");
        switch(argName) {

          // Database - Password
          case "password":
            Store.setState((state) => ({ "database": { ...state.database, "password": argValue }}));
          break;

          // Database - Username
          case "username":
            Store.setState((state) => ({ "database": { ...state.database, "username": argValue }}));
          break;

          // Environment - Deployment
          case "env":
            if(argValue === Constants.environments.includesargValue) {
                Store.setState((state) => ({ "environment": { ...state.environment, "deployment": argValue }}));
            } else {
              console.error(
                `[INVALID ARGUMENT]: "${argValue}" is not a valid Environment - Defaulting to "development".`,
                `Valid Environment values are: ${Object.values(Constants.environments).join(", ")}`
              );
            }
          break;

          // Environment - Server Port
          case "port":
            if(!isNaN(parseInt(argValue, 10))) {
              Store.setState((state) => ({ "environment": { ...state.environment, "serverPort": argValue }}));
            }
            else {
              console.error(`[INVALID ARGUMENT]: "${argValue}" is not a valid Server Port (must be an integer).`);
            }
          break;

          // Unrecognized Argument
          default:
            console.error(`[INVALID ARGUMENT]: "${argName}" is not recognized as a valid environment variable.`);
        }
      }
    }
  }

  static initializeEndpoints() {
    const { endpoints } = Store.getState();
    const endpointConfig = Controller.getEndpoints();
    for(const i in endpointConfig) {
      if(endpointConfig[i]) {
        const [path, method, callback] = endpointConfig[i];
        if(callback && method && path) {
          switch(method) {
            case "GET":
              app.get(path, (request, response) => response.send(callback(request, response)));
              if(!endpoints.includes(path)) endpoints.push(path);
            break;

            case "POST":
              app.post(path, (request, response) => response.send(callback(request, response)));
              if(!endpoints.includes(path)) endpoints.push(path);
            break;

            case "PUT":
              app.put(path, (request, response) => response.send(callback(request, response)));
              if(!endpoints.includes(path)) endpoints.push(path);
            break;

            case "DELETE":
              app.delete(path, (request, response) => response.send(callback(request, response)));
              if(!endpoints.includes(path)) endpoints.push(path);
            break;

            default:
              Logger.warn(`"${method}" is not recognized as a valid HTTP Method for the endpoint: ${path}`);
          }
        }
      }
    }
    Logger.debug(`Established endpoints: \n${endpoints.join("\n")}`);
  }

  static pollEnvironment(timeout) {
    const { environment, status } = Store.getState();
    if(status === Constants.status.pending) {

      let environmentReady = true;
      const environmentKeys = Object.keys(environment);
      for(const i in environmentKeys) {
        if(!environment[environmentKeys[i]]) {
          environmentReady = false;
          break;
        }
      }

      if(environmentReady) {
        Store.setState(() => ({ status: Constants.status.up }));
        Logger.info(`all systems go!`);
      } else if(timeout < 0) {
        console.error(`[ERROR] failed to initialize, shutting down . . .`);
        process.exit(0);
      } else {
        setTimeout(() => {
          Orchestration.pollEnvironment(timeout - startupPollInterval);
        }, startupPollInterval);
      }
    }
  }
}
module.exports = Orchestration;
