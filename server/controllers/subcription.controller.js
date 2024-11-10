const db = require('../models');
const Subscription = db.subscription;

// Start a subscription
exports.startSubscription = async (req, res) => {
  const { tierId } = req.body;
  try {
    const subscription = await Subscription.create({
      subscriber_id: req.userId,
      tier_id: tierId,
      start_date: new Date()
    });
    res.status(201).send(subscription);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Cancel a subscription
exports.cancelSubscription = async (req, res) => {
  const { subscriptionId } = req.body;
  try {
    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription || subscription.subscriber_id !== req.userId) {
      return res.status(404).send({ message: 'Subscription not found' });
    }

    subscription.end_date = new Date();
    await subscription.save();
    res.send({ message: 'Subscription canceled' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
