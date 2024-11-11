const db = require('../models');
const User = db.user;
const { Op } = require('sequelize');

// Initialize user as creator
exports.initializeCreator = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    user.is_creator = true;
    await user.save();

    // create a creator profile
    await db.creatorProfile.create({
      user_id: req.userId, // Link the profile to the user
      bio: "Here I am!", // Default bio
      description: "I am a creator, hope you like it here!", // Default description
      profile_banner: "https://example.com/your-image.jpg", // Default banner image URL
    });

    // create basic tier
    await db.tier.create({
      user_id: req.userId,
      name: 'Basic',
      description: "A basic tier",
      price: 0,
    });
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

exports.deleteUser = async (req, res) => {
  try {
    const result = await User.destroy({ where: { id: req.userId } });
    if (result === 0) return res.status(404).send({ message: 'User not found' });
    res.send({ message: 'User deleted' });
  } catch (error) {
    res.status(500).send({ message: error.message + req.userId });
  }
}


exports.allAccess = async (req, res) => {
  try {
    const users = await User.findByPk(req.userId);
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}