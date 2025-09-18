// backend/controllers/familyController.js

const { getSession } = require('../db/neo4j');
const { v4: uuidv4 } = require('uuid');

// Controller function to create a new person node
exports.createMember = async (req, res) => {
    const session = getSession();
    const { name, email } = req.body;
    const uuid = uuidv4(); // Generate a unique ID for the new member

    try {
        const result = await session.run(
            'CREATE (p:Person {uuid: $uuid, name: $name, email: $email}) RETURN p',
            { uuid, name, email }
        );
        const singleRecord = result.records[0];
        const node = singleRecord.get(0);
        res.status(201).json(node.properties);
    } catch (error) {
        console.error('Error creating member:', error);
        res.status(500).json({ error: 'Failed to create new member.' });
    } finally {
        await session.close();
    }
};

// Controller function to create a 'big-little' relationship
exports.createBigLittleRelationship = async (req, res) => {
    const session = getSession();
    const { big_uuid, little_uuid } = req.body;

    try {
        await session.run(
            'MATCH (b:Person {uuid: $big_uuid}), (l:Person {uuid: $little_uuid}) CREATE (b)-[:HAS_LITTLE]->(l)',
            { big_uuid, little_uuid }
        );
        res.status(201).json({ message: 'Relationship created successfully.' });
    } catch (error) {
        console.error('Error creating relationship:', error);
        res.status(500).json({ error: 'Failed to create relationship.' });
    } finally {
        await session.close();
    }
};

// Controller function to get a single member and their immediate connections
exports.getMember = async (req, res) => {
    const session = getSession();
    const { uuid } = req.params;

    try {
        const result = await session.run(
            'MATCH (p:Person {uuid: $uuid}) ' +
            'OPTIONAL MATCH (p)-[r]->(connected) ' +
            'RETURN p, COLLECT(DISTINCT {relationship: type(r), node: connected}) as connections',
            { uuid }
        );
        const record = result.records[0];
        if (!record) {
            return res.status(404).json({ error: 'Member not found.' });
        }
        const member = record.get('p').properties;
        const connections = record.get('connections').map(c => ({
            relationship: c.relationship,
            node: c.node.properties
        }));
        res.status(200).json({ ...member, connections });
    } catch (error) {
        console.error('Error fetching member:', error);
        res.status(500).json({ error: 'Failed to retrieve member data.' });
    } finally {
        await session.close();
    }
};

// Controller function to get the entire graph for visualization
exports.getTreeData = async (req, res) => {
    const session = getSession();

    try {
        const result = await session.run(
            'MATCH (n:Person) OPTIONAL MATCH (n)-[r]-(m:Person) ' +
            'RETURN COLLECT(DISTINCT n) AS nodes, COLLECT(DISTINCT r) AS relationships'
        );

        const nodes = result.records[0].get('nodes').map(node => ({
            uuid: node.properties.uuid,
            name: node.properties.name,
            email: node.properties.email,
        }));

        const relationships = result.records[0].get('relationships').map(rel => {
            // Add a check to ensure rel.start and rel.end are not undefined
            if (rel && rel.start && rel.end) {
                return {
                    // This is where the error is. The `uuid` is on the properties object
                    source: rel.start.properties.uuid,
                    target: rel.end.properties.uuid,
                    type: rel.type
                };
            }
            return null; // Return null if the relationship is malformed
        }).filter(Boolean); // Filter out any null values from the array

        res.status(200).send({ nodes, relationships });

    } catch (error) {
        console.error('Error fetching tree data:', error);
        res.status(500).send({ error: 'Failed to fetch tree data.' });
    } finally {
        await session.close();
    }
};

// Controller function to delete a member
exports.deleteMember = async (req, res) => {
    const session = getSession();
    const { uuid } = req.params;

    try {
        await session.run(
            'MATCH (p:Person {uuid: $uuid}) DETACH DELETE p',
            { uuid }
        );
        res.status(200).json({ message: 'Member deleted successfully.' });
    } catch (error) {
        console.error('Error deleting member:', error);
        res.status(500).json({ error: 'Failed to delete member.' });
    } finally {
        await session.close();
    }
};