let { DataTypes, sequelize } = require("../lib/index.js");

let agent = sequelize.define("agent", {
   id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
   },
   name: {
    type: DataTypes.STRING,
    allowNull: false,
   },
   email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
   },
});

module.exports = { agent };