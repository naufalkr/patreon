const { authjwt } = require("../middleware");
const controller = require("../controllers/content.controller");
const upload = require("../middleware/upload");

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
    [authjwt.verifyToken, authjwt.verifyUserId],
    upload.array('files', 5), // Allow up to 5 files
    controller.create
  );

  app.get("/api/content", controller.findAll);
  
  app.get("/api/content", controller.findOne);
  
  app.put(
    "/api/content",
    [authjwt.verifyToken, authjwt.verifyUserId],
    controller.update
  );
  
  app.delete(
    "/api/id/content",
    [authjwt.verifyToken, authjwt.verifyUserId],
    controller.delete
  );
};
