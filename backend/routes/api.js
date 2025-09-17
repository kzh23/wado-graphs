// backend/routes/api.js

const express = require('express');
const router = express.Router();
const familyController = require('../controllers/familyController');

// Relationships

// POST /api/members
// Creates a new person node in the database.
router.post('/members', familyController.createMember);

// POST /api/relationships/big-little
// Creates a HAS_LITTLE relationship between two people.
router.post('/relationships/big-little', familyController.createBigLittleRelationship);

// GET /api/members/:uuid
// Retrieves a single person and their immediate connections.
router.get('/members/:uuid', familyController.getMember);

// GET /api/tree-data
// Retrieves the entire graph for the visualization.
router.get('/tree-data', familyController.getTreeData);

// DELETE /api/members/:uuid
// Deletes a person and all their relationships.
router.delete('/members/:uuid', familyController.deleteMember);

module.exports = router;