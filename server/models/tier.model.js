module.exports = (sequelize, Sequelize) => {
  const Tier = sequelize.define("tier", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
  },{
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Tier;
}