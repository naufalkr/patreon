module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    profile_image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    is_creator: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
  });
  
  return User;
};