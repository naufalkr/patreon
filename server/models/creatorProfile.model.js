module.exports = (sequelize, Sequelize) => {
  const CreatorProfile = sequelize.define("creator_profile", {
    bio: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    profile_banner: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    sub_count: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
  },{
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return CreatorProfile;
}