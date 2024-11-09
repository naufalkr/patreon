
module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comment", {
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
    },
    text: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    likes: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Comment;
};