// backend/db/neo4j.js

const neo4j = require('neo4j-driver');

// If need authentication
const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'wado2025-26';

// Create a single driver instance.
// The driver manages connection pooling and should be created once per application.
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

// Verify the connection
driver.verifyConnectivity()
  .then(() => {
    console.log('Neo4j database connected successfully!');
  })
  .catch(error => {
    console.error('Neo4j connection error:', error);
  });

/**
 * Creates and returns a new Neo4j session.
 * @returns {neo4j.Session} A new Neo4j session.
 */
function getSession() {
  return driver.session();
}

// Export the session function and the driver instance for use in controllers.
module.exports = {
  getSession,
  driver
};