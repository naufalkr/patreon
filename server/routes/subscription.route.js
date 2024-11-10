const { authjwt } = require("../middleware");
const subscriptionController = require("../controllers/subscription.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  // Start a subscription
  app.post("/api/subscription/start", [authjwt.verifyToken], subscriptionController.startSubscription);

  // Cancel a subscription
  app.delete("/api/subscription/cancel", [authjwt.verifyToken], subscriptionController.cancelSubscription);
};
