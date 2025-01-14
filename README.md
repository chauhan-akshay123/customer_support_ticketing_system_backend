# Customer Support Ticketing System - Backend

This project is a **Customer Support Ticketing System Backend** implemented using **Node.js** and **Sequelize ORM**. It manages tickets, customers, and agents while providing various functionalities such as creating, updating, deleting, and retrieving ticket details with associated customer and agent information.

## Features

- Database seeding with sample data.
- CRUD operations for tickets, customers, and agents.
- Retrieve ticket details along with associated customer and agent information.
- Sort tickets by priority.
- Filter tickets by status.

## Prerequisites

Ensure you have the following installed:

- Node.js (v16 or later)
- npm or yarn
- A relational database supported by Sequelize (e.g., SQLite, PostgreSQL, MySQL)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd customer-support-ticketing-system-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the database connection in `lib` module.

4. Run the server:

   ```bash
   node index.js
   ```

The server will start on `http://localhost:3000`.

## API Endpoints

### 1. Database Seeding
**Endpoint:** `/seed_db`  
**Method:** GET  
Seeds the database with sample tickets, customers, and agents.

### 2. Fetch All Tickets with Details
**Endpoint:** `/tickets`  
**Method:** GET  
Fetches all tickets with associated customers and agents.

### 3. Fetch Ticket by ID
**Endpoint:** `/tickets/details/:id`  
**Method:** GET  
Fetches a specific ticket by ID along with its customer and agent details.

### 4. Fetch Tickets by Status
**Endpoint:** `/tickets/status/:status`  
**Method:** GET  
Fetches tickets filtered by their status (e.g., `open`, `closed`).

### 5. Fetch Tickets Sorted by Priority
**Endpoint:** `/tickets/sort-by-priority`  
**Method:** GET  
Fetches tickets sorted by their priority in ascending order.

### 6. Add a New Ticket
**Endpoint:** `/tickets/new`  
**Method:** POST  
Adds a new ticket with associated customer and agent information.

**Request Body:**
```json
{
  "title": "<string>",
  "description": "<string>",
  "status": "<string>",
  "priority": <integer>,
  "customerId": <integer>,
  "agentId": <integer>
}
```

### 7. Update Ticket Details
**Endpoint:** `/tickets/update/:id`  
**Method:** POST  
Updates an existing ticket by ID.

**Request Body:**
```json
{
  "title": "<string>",
  "description": "<string>",
  "status": "<string>",
  "priority": <integer>,
  "customerId": <integer>,
  "agentId": <integer>
}
```

### 8. Delete a Ticket
**Endpoint:** `/tickets/delete`  
**Method:** POST  
Deletes a ticket by ID.

**Request Body:**
```json
{
  "id": <integer>
}
```

## Folder Structure

```
project-root
│
├── models
│   ├── agent.model.js         # Agent model definition
│   ├── customer.model.js      # Customer model definition
│   ├── ticket.model.js        # Ticket model definition
│   ├── ticketAgent.model.js   # Ticket-Agent relationship model
│   └── ticketCustomer.model.js # Ticket-Customer relationship model
│
├── lib
│   └── index.js               # Sequelize database configuration
│
├── index.js                   # Main entry point
└── package.json               # Dependencies and scripts
```

## Tools and Technologies

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building RESTful APIs.
- **Sequelize**: ORM for managing database operations.
- **SQLite**: Default database (can be switched to others like MySQL, PostgreSQL).

## Error Handling
All endpoints return descriptive error messages in case of failures, along with appropriate HTTP status codes.

## Future Improvements

- Authentication and authorization.
- Pagination for ticket lists.
- Advanced filtering options.
- Integration with a frontend application.

## License
This project is licensed under the MIT License.
