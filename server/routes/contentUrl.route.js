
const { authjwt } = require("../middleware");
const controller = require("../controllers/contentUrl.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Create a new ContentUrl
  app.post(
    "/api/contenturl",
    [authjwt.verifyToken, authjwt.verifyUserId],
    controller.create
  );

  // Retrieve all ContentUrls
  app.get("/api/contenturls", controller.findAll);

  // Retrieve a single ContentUrl with id
  app.get("/api/contenturl/:id", controller.findOne);

  // Update a ContentUrl with id
  app.put(
    "/api/contenturl/:id",
    [authjwt.verifyToken, authjwt.verifyUserId],
    controller.update
  );

  // Delete a ContentUrl with id
  app.delete(
    "/api/contenturl/:id",
    [authjwt.verifyToken, authjwt.verifyUserId],
    controller.delete
  );
};