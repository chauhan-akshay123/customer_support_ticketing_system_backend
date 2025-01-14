let { DataTypes, sequelize } = require("../lib/index.js");
let { ticket } = require("./ticket.model.js");
let { customer } = require("./customer.model.js");

let ticketCustomer = sequelize.define("ticketCustomer", {
   ticketId: {
    type: DataTypes.INTEGER,
    references: {
        model: ticket,
        key: "id",
    },
   },
   customerId: {
    type: DataTypes.INTEGER,
    references: {
        model: customer,
        key: "id",
    },
   },
});

ticket.belongsToMany(customer, { through: ticketCustomer });
customer.belongsToMany(ticket, { through: ticketCustomer });

module.exports = { ticketCustomer };