// frontend/src/api/familyApi.js

const BASE_URL = 'http://localhost:3001/api'; // Replace with your backend URL when deployed

export async function createMember(memberData) {
  const response = await fetch(`${BASE_URL}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(memberData),
  });
  if (!response.ok) {
    throw new Error('Failed to create member');
  }
  return response.json();
}

export async function createBigLittleRelationship(data) {
  const response = await fetch(`${BASE_URL}/relationships/big-little`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create relationship');
  }
  return response.json();
}

export async function getTreeData() {
  const response = await fetch(`${BASE_URL}/tree-data`);
  if (!response.ok) {
    throw new Error('Failed to fetch tree data');
  }
  return response.json();
}