const express = require("express");
const myDB = require("./src/com/ss/utopia/configurations");
const Airport = require("./src/com/ss/utopia/models/Airport");
const app = express();
// const controller = require("./src/com/ss/utopia/AirportController");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
// app.use("/", controller);

app.get("/airports", (request, response) => {
  console.log(request.body);
  response.send(request.body);
});

app.post("/airports", (request, response) => {
  const newAirport = Airport.insert(request.body);
  response.send(newAirport);
});

app.put("/airports", (request, response) => {
  console.log(request.body);
  response.send(request.body);
});

app.delete("/airports", (request, response) => {
  console.log(request.body);
  response.send(request.body);
});

// Port
const port = 8081;
app.listen(port, () => {
  console.log("I am here! Listening on Port: " + port + " woot woot!");
});

