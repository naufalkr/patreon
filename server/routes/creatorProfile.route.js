const { authjwt } = require("../middleware");
const creatorController = require("../controllers/creatorProfile.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  // Edit creator profile (bio, banner)
  app.put("/api/creator/profile", [authjwt.verifyToken], creatorController.updateCreatorProfile);

  // get creator profile
  app.get("/api/creator/profile", [authjwt.verifyToken], creatorController.getCreatorProfile);
};
