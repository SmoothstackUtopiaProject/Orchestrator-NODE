const express = require("express");
const app = express();
const Constants = require("./resources/Constants.json");
const Controller = require("./Controller");
const Logger = require("./utils/Logger");
const Store = require("./Store");

class Orchestration {

  static initialize() {
    // 1) Environment
    Orchestration.initializeEnvironment();
    const { environment, serverPort } = Store.getState();

    // 2) Logger
    Logger.initialize(environment);
    Logger.info(`Orchestrator initialized with config: "${environment}"`);

    // 3) Endpoint Listeners
    app.listen(serverPort, () => {
      Logger.info(`Orchestrator listening on port: ${serverPort}`);
      Orchestration.initializeEndpoints();
    });
  }

  static initializeEnvironment() {
    const args = process.argv;
    for(const i in args) {
      if(args[i]) {
        const [ argName, argValue ] = args[i].split("=");
        switch(argName) {

          // Database - Host
          case "dbhost":
            Store.setState((state) => ({ "database": {...state.database, "host": argValue }}));
          break;

          // Database - Name
          case "dbname":
            Store.setState((state) => ({ "database": {...state.database, "database": argValue }}));
          break;

          // Database - Password
          case "dbpassword":
            Store.setState((state) => ({ "database": {...state.database, "password": argValue }}));
          break;

          // Database - Port
          case "dbport":
            if(!isNaN(parseInt(argValue, 10))) {
              Store.setState((state) => ({ "database": {...state.database, "port": argValue }}));
            }
            else {
              console.error(`[INVALID ARGUMENT]: "${argValue}" is not a valid Database Port (must be an integer).`);
            }
          break;

          // Database - User
          case "dbuser":
            Store.setState((state) => ({ "database": {...state.database, "user": argValue }}));
          break;

          // Server - Environment
          case "env":
            if(argValue === Constants.environments.includesargValue) {
                Store.setState(() => ({ "environment": argValue }));
            } else {
              console.error(
                `[INVALID ARGUMENT]: "${argValue}" is not a valid Environment - Defaulting to "development".`,
                `Valid Environment values are: ${JSON.stringify(Constants.environments)}`
              );
            }
          break;

          // Server - Port
          case "port":
            if(!isNaN(parseInt(argValue, 10))) {
              Store.setState(() => ({ "serverPort": argValue }));
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
}
module.exports = Orchestration;
