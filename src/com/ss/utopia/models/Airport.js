const bodyParser = require("body-parser");
const myDB = require("../configurations/index");

const Airport = (airport) => {
  this.airportIataId = airport.airportIataId;
  this.airportCityName = airport.airportCityName;
};

const insert = (airport) => {
  myDB.query("INSERT INTO airport (iata_id, city) values (?, ?)",
  [airport.airportIataId, airport.airportCityName], (error, results) => {
    if(error) {
      console.error("NOOOOOOOOOOOOOOOOOOOOOO - failed to insert airport.");
      console.error(error);
    } else {
      console.log("Airport successfully slid into DMs.");
    }
  });
};

Airport.insert = insert;

module.exports = Airport;
