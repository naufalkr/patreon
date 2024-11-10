
module.exports = (sequelize, Sequelize) => {
  const Like = sequelize.define("like", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'contents',
        key: 'id'
      },
      allowNull: false
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      allowNull: false
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Like;
};