const { authjwt } = require("../middleware");
const tierController = require("../controllers/tier.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  // Create a new tier
  app.post("/api/tier", [authjwt.verifyToken], tierController.createTier);

  // Get all tiers
  app.get("/api/tier", [authjwt.verifyToken], tierController.getAllTiers);

  // Update a specific tier
  app.put("/api/tier/:id", [authjwt.verifyToken], tierController.updateTier);

  // Delete a specific tier
  app.delete("/api/tier/:id", [authjwt.verifyToken], tierController.deleteTier);
};
