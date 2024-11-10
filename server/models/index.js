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
db.creatorProfile = require("./creatorProfile.model.js")(sequelize, Sequelize);
db.tier = require("./tier.model.js")(sequelize, Sequelize);
db.subcription = require("./subcription.model.js")(sequelize, Sequelize);
db.payment = require("./payment.model.js")(sequelize, Sequelize);
db.like = require("./like.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through : 'user_roles',
});
db.user.belongsToMany(db.role, {
  through: 'user_roles',
});

// Define relationships
db.user.hasOne(db.creatorProfile, {foreignKey: 'user_id'});
db.creatorProfile.belongsTo(db.user, {foreignKey: 'user_id'});

db.user.hasMany(db.tier, {foreignKey: 'user_id'});
db.tier.belongsTo(db.user, {foreignKey: 'user_id'});

db.tier.hasMany(db.subcription, {foreignKey: 'tier_id'});
db.subcription.belongsTo(db.tier, {foreignKey: 'tier_id'});

db.user.hasMany(db.subcription, {foreignKey: 'subcriber_id'});
db.subcription.belongsTo(db.user, {foreignKey: 'subcriber_id'});

db.user.hasMany(db.payment, {foreignKey: 'user_id'});
db.payment.belongsTo(db.user, {foreignKey: 'user_id'});

db.subcription.hasMany(db.payment, {foreignKey: 'subcription_id'});
db.payment.belongsTo(db.subcription, {foreignKey: 'subcription_id'});

db.user.hasMany(db.content, { foreignKey: 'user_id' });
db.content.belongsTo(db.user, { foreignKey: 'user_id' });

// Add comment relationships
db.content.hasMany(db.comment, { foreignKey: 'content_id' });
db.comment.belongsTo(db.content, { foreignKey: 'content_id' });
db.user.hasMany(db.comment, { foreignKey: 'user_id' });
db.comment.belongsTo(db.user, { foreignKey: 'user_id' });

db.tier.hasMany(db.content, { foreignKey: 'tier_id' });
db.content.belongsTo(db.tier, { foreignKey: 'tier_id' });
// Add like relationships
db.content.hasMany(db.like, { foreignKey: 'content_id' });
db.like.belongsTo(db.content, { foreignKey: 'content_id' });
db.user.hasMany(db.like, { foreignKey: 'user_id' });
db.like.belongsTo(db.user, { foreignKey: 'user_id' });

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;