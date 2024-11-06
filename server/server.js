const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");


// Create express app
const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
}

app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
db.sequelize.sync().
  then(() => {
    console.log("Drop and re-sync db.");
  }).
  catch((err) => {
    console.log(err);
  });

// simple initial role
function initial(){
  Role.create({
    id: 1,
    name: "user"
  });
  Role.create({
    id: 2,
    name: "admin"
  });
  Role.create({
    id: 3,
    name: "moderator"
  })
}

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the application." });
});

// routes
require("./routes/auth.route")(app);
require("./routes/user.route")(app);

// Set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});