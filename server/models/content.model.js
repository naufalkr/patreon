module.exports = (sequelize, Sequelize) => {
  const Content = sequelize.define("content", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT
    },
    upload_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    like_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    comment_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    view_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    tags: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    tier: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 3
      }
    },
    media_file: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Content;
};
