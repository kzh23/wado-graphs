// frontend/src/components/MemberForm.js

import React, { useState } from 'react';
import { createMember } from '../api/familyApi';

function MemberForm({ onMemberAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newMember = await createMember({ name, email});
      console.log('Member added:', newMember);
      alert(`Member '${newMember.name}' added successfully!`);
      // Reset form fields
      setName('');
      setEmail('');
      // Notify parent component to refresh data
      if (onMemberAdded) {
        onMemberAdded();
      }
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Member</h3>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <button type="submit">Add Member</button>
    </form>
  );
}

export default MemberForm;
