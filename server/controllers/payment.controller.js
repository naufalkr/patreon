const db = require('../models');
const Payment = db.payment;

// Create a payment log
exports.createPaymentLog = async (req, res) => {
  const { subscriptionId, amount } = req.body;
  try {
    const payment = await Payment.create({
      user_id: req.userId,
      subscription_id: subscriptionId,
      amount: amount,
      payment_date: new Date()
    });
    res.status(201).send(payment);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
