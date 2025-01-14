let { DataTypes, sequelize } = require("../lib/index.js");
let { ticket } = require("./ticket.model.js");
let { agent } = require("./agent.model.js");

let ticketAgent = sequelize.define("ticketAgent", {
  ticketId: {
    type: DataTypes.INTEGER,
    references: {
        model: ticket,
        key: "id",
    },
  },
  agentId: {
    type: DataTypes.INTEGER,
    references: {
        model: agent,
        key: "id"
    },
  },
});

ticket.belongsToMany(agent, { through: ticketAgent });
agent.belongsToMany(ticket, { through: ticketAgent });

module.exports = { ticketAgent };