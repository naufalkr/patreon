
const { authjwt } = require("../middleware");
const controller = require("../controllers/comment.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/content/:contentId/comments",
    [authjwt.verifyToken],
    controller.create
  );

  app.get("/api/content/:contentId/comments", controller.findAll);
  
  app.get("/api/comments/:id", controller.findOne);
  
  app.put(
    "/api/comments/:id",
    [authjwt.verifyToken],
    controller.update
  );
  
  app.delete(
    "/api/comments/:id",
    [authjwt.verifyToken],
    controller.delete
  );
};