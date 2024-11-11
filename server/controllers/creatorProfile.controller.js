const db = require('../models');
const User = db.user;
const CreatorProfile = db.creatorProfile;

// Update creator profile
exports.updateCreatorProfile = async (req, res) => {
  const { bio, banner, description } = req.body;
  try {
    const profile = await CreatorProfile.findOne({ where: { user_id: req.userId } });
    if (!profile) return res.status(404).send({ message: 'Creator profile not found' });

    profile.bio = bio || profile.bio;
    profile.description = description || profile.description;
    // profile.profile_banner = banner || profile.banner;

    await profile.save();
    res.send({ message: 'Creator profile updated' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get creator profile
exports.getCreatorProfile = async (req, res) => {
  try {
    const profile = await CreatorProfile.findOne({ where: { user_id: req.userId } });
    if (!profile) return res.status(404).send({ message: 'Creator profile not found' });

    res.send(profile);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};