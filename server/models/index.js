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
db.comment = require("./comment.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through : 'user_roles',
});
db.user.belongsToMany(db.role, {
  through: 'user_roles',
});

// Define relationships
db.user.hasMany(db.content, { foreignKey: 'user_id' });
db.content.belongsTo(db.user, { foreignKey: 'user_id' });

// Add comment relationships
db.content.hasMany(db.comment, { foreignKey: 'content_id' });
db.comment.belongsTo(db.content, { foreignKey: 'content_id' });
db.user.hasMany(db.comment, { foreignKey: 'user_id' });
db.comment.belongsTo(db.user, { foreignKey: 'user_id' });

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;