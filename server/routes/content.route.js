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
    upload.single('media_file'), // Ensure the field name matches the form data
    controller.create
  );

  app.get("/api/content", controller.findAll);
  
  app.get("/api/content/:id", controller.findOne);
  
  app.put(
    "/api/content/:id",
    [authjwt.verifyToken, authjwt.verifyUserId],
    upload.single('media_file'), // Ensure the field name matches the form data
    controller.update
  );
  
  app.delete(
    "/api/content/:id",
    [authjwt.verifyToken, authjwt.verifyUserId],
    controller.delete
  );
};
