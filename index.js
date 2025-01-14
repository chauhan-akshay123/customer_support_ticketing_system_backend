const express = require("express");
const cors = require("cors");
let { agent } = require("./models/agent.model");
let { ticket } = require("./models/ticket.model");
let { customer } = require("./models/customer.model");
let { ticketCustomer } = require("./models/ticketCustomer.model");
let { ticketAgent } = require("./models/ticketAgent.model");
const { sequelize } = require("./lib");

const app = express();
app.use(express.json());

// Endpoint to seed the database
app.get("/seed_db", async (req, res) => {
    try {
      await sequelize.sync({ force: true });
  
      const tickets = await ticket.bulkCreate([
        {
          title: 'Login Issue',
          description: 'Cannot login to account',
          status: 'open',
          priority: 1,
        },
        {
          title: 'Payment Failure',
          description: 'Payment not processed',
          status: 'closed',
          priority: 2,
        },
        {
          title: 'Bug Report',
          description: 'Found a bug in the system',
          status: 'open',
          priority: 3,
        },
      ]);
  
      const customers = await customer.bulkCreate([
        { name: 'Alice', email: 'alice@example.com' },
        { name: 'Bob', email: 'bob@example.com' },
      ]);
  
      const agents = await agent.bulkCreate([
        { name: 'Charlie', email: 'charlie@example.com' },
        { name: 'Dave', email: 'dave@example.com' },
      ]);
  
      await ticketCustomer.bulkCreate([
        { ticketId: tickets[0].id, customerId: customers[0].id },
        { ticketId: tickets[2].id, customerId: customers[0].id },
        { ticketId: tickets[1].id, customerId: customers[1].id },
      ]);
  
      await ticketAgent.bulkCreate([
        { ticketId: tickets[0].id, agentId: agents[0].id },
        { ticketId: tickets[2].id, agentId: agents[0].id },
        { ticketId: tickets[1].id, agentId: agents[1].id },
      ]);
  
      return res.json({ message: 'Database seeded successfully' });
    } catch (error) {
      return res.status(500).json({
        message: "Error seeding the database",
        error: error.message,
      });
    }
  });

  // Helper function to get ticket's associated customers
async function getTicketCustomers(ticketId) {
    const ticketCustomers = await ticketCustomer.findAll({
      where: { ticketId },
    });
  
    const customerData = [];
    for (let cus of ticketCustomers) {
      const customerRecord = await customer.findOne({ where: { id: cus.customerId } });
      if (customerRecord) {
        customerData.push(customerRecord);
      }
    }
  
    return customerData.length === 1 ? customerData[0] : customerData; // Single or multiple customers
  }
  
  // Helper function to get ticket's associated agents
  async function getTicketAgents(ticketId) {
    const ticketAgents = await ticketAgent.findAll({
      where: { ticketId },
    });
  
    const agentData = [];
    for (let agt of ticketAgents) {
      const agentRecord = await agent.findOne({ where: { id: agt.agentId } });
      if (agentRecord) {
        agentData.push(agentRecord);
      }
    }
  
    return agentData.length === 1 ? agentData[0] : agentData; // Single or multiple agents
  }
  
  // Helper function to get ticket details with associated customers and agents
  async function getTicketDetails(ticketData) {
    const customer = await getTicketCustomers(ticketData.id);
    const agent = await getTicketAgents(ticketData.id);
  
    return {
      ...ticketData.dataValues,
      customer,
      agent,
    };
  }
  
  // Endpoint to fetch all tickets with associated customers and agents
  app.get("/tickets", async (req, res) => {
    try {
      // Fetch all tickets
      const tickets = await ticket.findAll();
  
      const ticketDetails = [];
      for (let tkt of tickets) {
        const detailedTicket = await getTicketDetails(tkt);
        ticketDetails.push(detailedTicket);
      }
  
      return res.status(200).json({ tickets: ticketDetails });
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching tickets",
        error: error.message,
      });
    }
  });

// Endpoint to get ticket by Id
app.get("/tickets/details/:id", async (req, res) => {
  try{
   let ticketId = parseInt(req.params.id);
   const ticketData = await ticket.findOne({ where: { id: ticketId }, }); 

   if(!ticketData) {
      return res.status(404).json({ message: `Ticket with ID ${ticketId} not found.` });
   }

   const detailedTicket = await getTicketDetails(ticketData);
   
   return res.status(200).json({ ticket: detailedTicket }); 
  } catch(error){
    return res.status(500).json({ message: "Error fetching the ticket details", error: error.message });
  }
});

// Endpoint to get ticket by status
app.get("/tickets/status/:status", async (req, res) => {
    const status = req.params.status;
    try {
      // Find tickets by status
      const tickets = await ticket.findAll({
        where: { status },
      });
  
      if (tickets.length === 0) {
        return res.status(404).json({ message: "Tickets not found." });
      }
  
      const detailedTickets = [];
  
      for (const ticketData of tickets) {
        const detailedTicket = await getTicketDetails(ticketData);
        detailedTickets.push(detailedTicket);
      }
  
      return res.status(200).json({ tickets: detailedTickets });
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching tickets by status",
        error: error.message,
      });
    }
  });
  
  // Endpoint to get tickets sorted by priority (ascending)
  app.get("/tickets/sort-by-priority", async (req, res) => {
    try{
      const tickets = await ticket.findAll({ order: [["priority", "ASC"]] });
      
      if(tickets.length === 0){
        return res.status(404).json({ message: "Tickets not found." });
      }
      
      const detailedTickets = [];

      for(const ticketData of tickets){
        const detailedTicket = await getTicketDetails(ticketData);
        detailedTickets.push(detailedTicket);
      }
      
      return res.status(200).json({ tickets: detailedTickets });
    } catch(error){
      return res.status(500).json({ message: "Error fetching tickets sortde by priority.", error: error.message });
    }
  });

// Function to add a new ticket
async function addNewTicket(ticketData) {
    const { title, description, status, priority, customerId, agentId } = ticketData;
  
    if (!title || !description || !status || !priority || !customerId || !agentId) {
      throw new Error("All fields are required");
    }
  
    // Create the new ticket
    const newTicket = await ticket.create({
      title,
      description,
      status,
      priority,
    });
  
    // Manually create a record in the ticketCustomer table
    await ticketCustomer.create({
      ticketId: newTicket.id,
      customerId: customerId
    });
  
    // Manually create a record in the ticketAgent table
    await ticketAgent.create({
      ticketId: newTicket.id,
      agentId: agentId
    });
  
    // Retrieve the detailed ticket with customer and agent information
    const detailedTicket = await ticket.findOne({
      where: { id: newTicket.id },
      include: [
        {
          model: customer,
          attributes: ["id", "name", "email", "createdAt", "updatedAt"],
        },
        {
          model: agent,
          attributes: ["id", "name", "email", "createdAt", "updatedAt"],
        },
      ],
    });
  
    return detailedTicket;
  }
  
  // Endpoint to add a new ticket
  app.post("/tickets/new", async (req, res) => {
    try {
      const detailedTicket = await addNewTicket(req.body);
  
      return res.status(201).json({ ticket: detailedTicket });
    } catch (error) {
      return res.status(500).json({ message: "Error adding a new ticket", error: error.message });
    }
  });
  
 // Function to update a ticket's details
async function updateTicketDetails(ticketData, ticketId) {
    const { title, description, status, priority, customerId, agentId } = ticketData;
  
    const ticketRecord = await ticket.findByPk(ticketId);
    if (!ticketRecord) {
      throw new Error("Ticket not found");
    }
  
    if (title) {
      ticketRecord.title = title;
    }
    if (description) {
      ticketRecord.description = description;
    }
    if (status) {
      ticketRecord.status = status;
    }
    if (priority) {
      ticketRecord.priority = priority;
    }
  
    await ticketRecord.save();
  
    if (customerId) {
      await TicketCustomer.destroy({ where: { ticketId: ticketId } });
      await TicketCustomer.create({ ticketId: ticketId, customerId: customerId });
    }
  
    if (agentId) {
      await TicketAgent.destroy({ where: { ticketId: ticketId } });
      await TicketAgent.create({ ticketId: ticketId, agentId: agentId });
    }
  
    const updatedTicket = await ticket.findOne({
      where: { id: ticketId },
      include: [
        {
          model: customer,
          attributes: ["id", "name", "email", "createdAt", "updatedAt"],
          as: 'customers', 
        },
        {
          model: agent,
          attributes: ["id", "name", "email", "createdAt", "updatedAt"],
          as: 'agents', 
        },
      ],
    });
  
    return updatedTicket;
  }
  
  // Endpoint to update ticket details
  app.post("/tickets/update/:id", async (req, res) => {
    const ticketId = req.params.id;
  
    try {
      const updatedTicket = await updateTicketDetails(req.body, ticketId);
  
      return res.status(200).json({ ticket: updatedTicket });
    } catch (error) {
      return res.status(500).json({ message: "Error updating the ticket", error: error.message });
    }
  });

  async function deleteTicketById(ticketId) {
    try {
      await ticketCustomer.destroy({
        where: { ticketId: ticketId },
      });
  
      await ticketAgent.destroy({
        where: { ticketId: ticketId },
      });
  
      const ticketDeleted = await ticket.destroy({
        where: { id: ticketId },
      });
  
      return ticketDeleted;
    } catch (error) {
      throw new Error("Error deleting the ticket: " + error.message);
    }
  }

  app.post("/tickets/delete", async (req, res) => {
    const { id } = req.body;
  
    try {
      const ticketDeleted = await deleteTicketById(id);
  
      if (ticketDeleted) {
        return res.status(200).json({
          message: `Ticket with ID ${id} deleted successfully.`,
        });
      } else {
        return res.status(404).json({
          message: `Ticket with ID ${id} not found.`,
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  });
  
  app.listen(3000, () => {
    console.log("Server is running on PORT: 3000");
  }); 