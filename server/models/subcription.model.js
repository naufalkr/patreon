module.exports = (sequelize, Sequelize) => {
  const Subcription = sequelize.define("subcription", {
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

  return Subcription;
}