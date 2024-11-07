const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.content = require("./content.model.js")(sequelize, Sequelize);
db.contentUrl = require("./contentUrl.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through : 'user_roles',
});
db.user.belongsToMany(db.role, {
  through: 'user_roles',
});

// Define relationships
db.user.hasMany(db.content, { foreignKey: 'user_id' });
db.content.belongsTo(db.user, { foreignKey: 'user_id' });

db.content.hasMany(db.contentUrl, { foreignKey: 'content_id' });
db.contentUrl.belongsTo(db.content, { foreignKey: 'content_id' });

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;