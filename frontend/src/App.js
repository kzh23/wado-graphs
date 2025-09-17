// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import { getTreeData } from './api/familyApi';
import MemberForm from './components/MemberForm';
import RelationshipForm from './components/RelationshipForm';
import FamilyGraph from './components/FamilyGraph';
import './App.css';

function App() {
  // Log when the component renders or re-renders
  console.log('App component is rendering...');

  const [graphData, setGraphData] = useState({ nodes: [], relationships: [] });
  const [loading, setLoading] = useState(true);

  const fetchGraphData = async () => {
    // Log when this function is called
    console.log('Fetching graph data...');
    try {
      const data = await getTreeData();
      setGraphData(data);
      setLoading(false);
      // Log the fetched data
      console.log('Data successfully fetched:', data);
    } catch (error) {
      console.error('Failed to fetch graph data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  return (
    <div className="App">
      <h1>Family Tree Application</h1>
      <div className="main-content">
        <div className="controls">
          <MemberForm onMemberAdded={fetchGraphData} />
          {!loading && graphData.nodes.length > 0 && (
            <RelationshipForm
              members={graphData.nodes}
              onRelationshipAdded={fetchGraphData}
            />
          )}
        </div>
        <div className="graph-container">
          {loading ? (
            <p>Loading family tree...</p>
          ) : (
            <FamilyGraph data={graphData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;