const myDB = require("../configurations");
const airportService = require("../models/Airport");

const airportService = {
  async create(request, response) {
    try {
      console.log(request);
      console.log(request.body);
      // const airport = await airportService.insert(request.body);
    } 
    catch(err) {  
      console.error(err);
    }
  },
};

module.exports = { airportService };

// exports.create = function(request, response) {
//   const airport = request.body;
//   console.log(airport);
//   airportService.insert(airport);
// };