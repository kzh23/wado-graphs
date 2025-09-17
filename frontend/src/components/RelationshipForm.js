// frontend/src/components/RelationshipForm.js

import React, { useState } from 'react';
import { createBigLittleRelationship } from '../api/familyApi';

function RelationshipForm({ members, onRelationshipAdded }) {
  const [bigUuid, setBigUuid] = useState('');
  const [littleUuid, setLittleUuid] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!bigUuid || !littleUuid) {
      alert('Please select both a big and a little.');
      return;
    }
    if (bigUuid === littleUuid) {
        alert('A member cannot be their own big or little.');
        return;
    }

    try {
      const data = { big_uuid: bigUuid, little_uuid: littleUuid };
      await createBigLittleRelationship(data);
      alert('Relationship created successfully!');
      setBigUuid('');
      setLittleUuid('');
      if (onRelationshipAdded) {
        onRelationshipAdded(); // This will trigger a graph refresh
      }
    } catch (error) {
      console.error('Error creating relationship:', error);
      alert('Failed to create relationship.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Big/Little Relationship</h3>
      <div>
        <label>Big:</label>
        <select value={bigUuid} onChange={(e) => setBigUuid(e.target.value)} required>
          <option value="">Select a Big</option>
          {members.map(member => (
            <option key={member.uuid} value={member.uuid}>{member.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Little:</label>
        <select value={littleUuid} onChange={(e) => setLittleUuid(e.target.value)} required>
          <option value="">Select a Little</option>
          {members.map(member => (
            <option key={member.uuid} value={member.uuid}>{member.name}</option>
          ))}
        </select>
      </div>
      <button type="submit">Add Relationship</button>
    </form>
  );
}

export default RelationshipForm;