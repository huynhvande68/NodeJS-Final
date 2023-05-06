const Sequelize = require("sequelize");
const sequelize = require("../config/connectDB");

const Account = sequelize.define("Account", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  fullname: { type: DataTypes.STRING, allowNull: false },
  username: { type: Sequelize.STRING, allowNull: false, unique: true },
  password: { type: Sequelize.STRING, allowNull: false },
  displayName: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false, unique: true },
  createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
});

const Email = sequelize.define("Email", {
  subject: { type: Sequelize.STRING, allowNull: false },
  body: { type: Sequelize.STRING, allowNull: false },
  attachments: { type: Sequelize.ARRAY(Sequelize.STRING) },
  sentAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
});

Email.belongsTo(Account, { foreignKey: "senderId", as: "sender" });
Email.belongsTo(Account, { foreignKey: "recipientId", as: "recipient" });

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Tables synced successfully!");
  })
  .catch((error) => {
    console.error("Unable to sync tables:", error);
  });
module.exports = { Account, Email };
