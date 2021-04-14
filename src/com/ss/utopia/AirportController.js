const express = require("express");
const router = express.route();

const { airportService } = require("./services/AirportService");
router.route("/airports")
  .post(airportService.create);

module.exports = router;
