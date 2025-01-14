let { DataTypes, sequelize } = require("../lib/index.js");

let customer = sequelize.define("customer", {
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

module.exports = { customer };