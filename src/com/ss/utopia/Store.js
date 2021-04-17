const Constants = require("./resources/Constants.json");

class Store {
  static defaultState = {
    database: {
      host: "utopiaairlines-mysql.clufugeeqpsu.us-east-1.rds.amazonaws.com",
      user: "aws",
      password: "UtopiaAirlines1",
      database: "utopia",
      port: 3306,
    },
    endpoints: [],
    environment: Constants.environments.development,
    health: {
      average: 100,
      connectedServices: 11,
      requestsPerMinute: 150,
      warnings: [
        "[SERVICE INTERRUPTION] 2021-4-16-07:34:36 - UtopiaAirplaneMS: 12733234-9fa5-11eb-a8b3-0242ac130003 - 10.0.0.13",
        "[SERVICE INTERRUPTION] 2021-4-12-18:06:54 - UtopiaAirplaneMS: 12733234-9fa5-11eb-a8b3-0242ac130003 - 10.0.0.13",
      ],
      errors: [],
    },
    serverPort: 8080,
    services: {
      example1: {
        id: "12733234-9fa5-11eb-a8b3-0242ac130003",
        ip: "10.0.0.13",
        type: "UtopiaAirplaneMS",
        ping: 40,
        uptime: 9870003,
        downtime: 6400,
        interruptions: [
            { start: "2021-4-16-07:34:36", end: "2021-4-16-07:35:36" },
            { start: "2021-4-12-18:06:54", end: "2021-4-12-18:08:54" },
        ],
      },
    },
    status: Constants.status.pending,
  };

  static state = {
    ...Store.defaultState,
  };

  static getState() {
    return Store.state;
  }

  static setState(callback) {
    const stateChange = callback(Store.state);
    Store.state = {
      ...Store.state,
      ...stateChange,
    };
  }
}
module.exports = Store;
