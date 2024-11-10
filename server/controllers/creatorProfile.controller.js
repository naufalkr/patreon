const db = require('../models');
const CreatorProfile = db.creatorProfile;

// Update creator profile
exports.updateCreatorProfile = async (req, res) => {
  const { bio, banner } = req.body;
  try {
    const profile = await CreatorProfile.findOne({ where: { user_id: req.userId } });
    if (!profile) return res.status(404).send({ message: 'Creator profile not found' });

    profile.bio = bio || profile.bio;
    profile.profile_banner = banner || profile.banner;

    await profile.save();
    res.send({ message: 'Creator profile updated' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};