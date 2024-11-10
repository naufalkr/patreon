const { authjwt } = require("../middleware");
const paymentController = require("../controllers/payment.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  // Create a payment log
  app.post("/api/payment/log", [authjwt.verifyToken], paymentController.createPaymentLog);
};
