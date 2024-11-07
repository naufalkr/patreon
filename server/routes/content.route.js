const { authjwt } = require("../middleware");
const controller = require("../controllers/content.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/content",
    [authjwt.verifyToken],
    controller.create
  );

  app.get("/api/content", controller.findAll);
  
  app.get("/api/content/:id", controller.findOne);
  
  app.put(
    "/api/content/:id",
    [authjwt.verifyToken],
    controller.update
  );
  
  app.delete(
    "/api/content/:id",
    [authjwt.verifyToken],
    controller.delete
  );
};
