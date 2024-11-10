const db = require('../models');
const User = db.user;
const { Op } = require('sequelize');

// Initialize user as creator
exports.initializeCreator = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).send({ message: 'User not found' });

    user.is_creator = true;
    await user.save();
    res.send({ message: 'User is now a creator' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const { username, email, password, profile_image } = req.body;
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).send({ message: 'User not found' });

    user.username = username || user.username;
    user.email = email || user.email;
    if (password) user.password = password; // hash password in production
    user.profile_image = profile_image || user.profile_picture;

    await user.save();
    res.send({ message: 'User profile updated' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Search for creators
exports.searchCreators = async (req, res) => {
  const { query } = req.query; // e.g., ?query=artist

  try {
    const creators = await User.findAll({
      where: {
        is_creator: true,
        [Op.or]: [
          { username: { [Op.iLike]: `%${query}%` } }, // Search by username
          { '$creatorProfile.bio$': { [Op.iLike]: `%${query}%` } } // Search by bio in creator profile
        ]
      },
      include: [{
        model: db.creatorProfile,
        attributes: ['bio', 'banner']
      }]
    });

    res.send(creators);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};