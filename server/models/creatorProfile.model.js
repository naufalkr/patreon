module.exports = (sequelize, Sequelize) => {
  const CreatorProfile = sequelize.define("creator_profile", {
    bio: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    profile_banner: {
      type: Sequelize.STRING,
      allowNull: true,
    }
  },{
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return CreatorProfile;
}