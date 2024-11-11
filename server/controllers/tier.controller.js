const db = require('../models');
const Tier = db.tier;

// Create a new tier
exports.createTier = async (req, res) => {
  try {
    const tier = await Tier.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      user_id: req.userId
    });
    res.status(201).send(tier);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get all tiers related to the user
exports.getAllTiers = async (req, res) => {
  try {
    const tiers = await Tier.findAll({ where: { user_id: req.userId } });
    if (tiers.length === 0) return res.status(404).send({ message: 'No tiers found' });
    res.send(tiers);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update a tier by ID
exports.updateTier = async (req, res) => {
  try {
    const tier = await Tier.findByPk(req.params.id);
    if (!tier) return res.status(404).send({ message: 'Tier not found' });

    tier.name = req.body.name || tier.name;
    tier.description = req.body.description || tier.description;
    tier.price = req.body.price || tier.price;

    await tier.save();
    res.send({ message: 'Tier updated' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a tier by ID
exports.deleteTier = async (req, res) => {
  try {
    const result = await Tier.destroy({ where: { id: req.params.id } });
    if (result === 0) return res.status(404).send({ message: 'Tier not found' });
    res.send({ message: 'Tier deleted' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
