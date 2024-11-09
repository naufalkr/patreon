
const { authjwt } = require("../middleware");
const controller = require("../controllers/comment.controller");

module.exports = function(app) {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  // Create a comment
  app.post(
    "/api/content/:contentId/comments",
    [authjwt.verifyToken],
    controller.create
  );

  // Get all comments for a content
  app.get(
    "/api/content/:contentId/comments",
    controller.findAllByContent
  );

  // Update a comment
  app.put(
    "/api/comments/:id",
    [authjwt.verifyToken],
    controller.update
  );

  // Delete a comment
  app.delete(
    "/api/comments/:id",
    [authjwt.verifyToken],
    controller.delete
  );
};