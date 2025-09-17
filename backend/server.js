// backend/server.js

const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const { driver } = require('./db/neo4j'); // Import the Neo4j driver

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json()); // Allows the app to parse JSON from the body of requests
app.use(cors());         // Enables Cross-Origin Resource Sharing

// API Routes
app.use('/api', apiRoutes); // Mount the API routes under the /api path

// Root endpoint for testing
app.get('/', (req, res) => {
    res.send('Family Tree API is running!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Handle graceful shutdown
const shutdown = () => {
    console.log('Closing Neo4j driver...');
    driver.close();
    console.log('Shutting down server...');
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);