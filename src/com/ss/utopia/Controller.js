const Store = require("./Store");

class Controller {
  static endpoints = [
    ["/environment", "GET", (request, response) => this.handleEnvironmentCheck(request, response)],
    ["/health", "GET", (request, response) => this.handleHealthCheck(request, response)],
    ["/status", "GET", (request, response) => this.handleStatusCheck(request, response)],
  ];

  static getEndpoints() {
    return this.endpoints;
  }

  static handleEnvironmentCheck(request, response) {
    // Log request
    const { environment } = Store.getState();
    response.send({ environment });
  }

  static handleHealthCheck(request, response) {
    // Log request
    const { health } = Store.getState();
    response.send({ health });
  }

  static handleStatusCheck(request, response) {
    // Log request
    const { status } = Store.getState();
    response.send({ status });
  }

}
module.exports = Controller;
