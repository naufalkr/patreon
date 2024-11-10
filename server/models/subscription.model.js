module.exports = (sequelize, Sequelize) => {
  const Subscription = sequelize.define("subscription", {
    start_date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },{
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Subscription;
}