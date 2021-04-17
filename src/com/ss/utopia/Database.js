const mysql = require("mysql");
const Logger = require("./utils/Logger");

class Database {
  static connection = null;

  static initialize(database) {
    const { host, user, password, databaseName, port } = database;
    if(!host) Logger.error(`Invalid Database host: ${host}`);
    else if(!user) Logger.error(`Invalid Database user: ${user}`);
    else if(!password) Logger.error(`Invalid Database password: ${password}`);
    else if(!databaseName) Logger.error(`Invalid Database name: ${databaseName}`);
    else if(!port) Logger.error(`Invalid Database port: ${port}`);
    else {
      Database.connection = mysql.createConnection(database);
      Database.connection.connect((error) => {
        if(error) Logger.error(`Database: ${error}`);
        else Logger.info(`Database connection established: ${host}:${databaseName}`);
      });
    }
  }
}
module.exports = Database;
