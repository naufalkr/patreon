module.exports = (sequelize, Sequelize) => {
  const Payment = sequelize.define("payment",{
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
  },{
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Payment;
}