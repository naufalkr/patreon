const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');

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
const Role = db.role;
db.sequelize.sync().
  then(() => {
    console.log("Drop and re-sync db.");
    // initial();
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

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// routes
require("./routes/auth.route")(app);
require("./routes/user.route")(app);
require("./routes/content.route")(app);  // Add this line
require("./routes/contentUrl.route")(app);  // Add this line
require("./routes/comment.route")(app); // Add this line

// Set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});