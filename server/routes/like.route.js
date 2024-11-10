const { authjwt } = require("../middleware");
const controller = require("../controllers/like.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/content/:contentId/like",
    [authjwt.verifyToken],
    controller.toggleLike
  );

  app.get(
    "/api/content/:contentId/hasLiked",
    [authjwt.verifyToken],
    controller.hasLiked
  );
};