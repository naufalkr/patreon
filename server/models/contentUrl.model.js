module.exports = (sequelize, Sequelize) => {
  const ContentUrl = sequelize.define("content_urls", {
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
      }
    },
    url: {
      type: Sequelize.STRING(500),
      allowNull: false
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return ContentUrl;
};
