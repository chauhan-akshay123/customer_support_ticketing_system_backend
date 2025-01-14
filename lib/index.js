let sq = require("sequelize");

let sequelize = new sq.Sequelize({
    dialect: "sqlite",
    storage: "./database/database.sqlite"  
});

module.exports = {
    sequelize,
    DataTypes: sq.DataTypes
};