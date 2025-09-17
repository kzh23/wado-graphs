// frontend/src/components/FamilyGraph.js

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function FamilyGraph({ data }) {
  // A ref to hold a reference to the SVG DOM element
  const svgRef = useRef();

  useEffect(() => {
    // Return early if there's no data
    if (!data || !data.nodes || data.nodes.length === 0) return;

    // Clear any previous SVG content to prevent duplicates
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 800;
    const height = 600;

    // Create the SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create a force simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.relationships).id(d => d.uuid).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create the links (relationships)
    const link = svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(data.relationships)
      .join('line');

    // Create the nodes (people)
    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(data.nodes)
      .join('circle')
      .attr('r', 10)
      .attr('fill', 'steelblue')
      .call(drag(simulation)); // Add drag functionality

    // Add tooltips or text labels to nodes
    node.append('title')
      .text(d => d.name);

    // Update positions on each tick of the simulation
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    });

  }, [data]); // The effect runs whenever the 'data' prop changes

  // Define a drag behavior for the nodes
  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  return (
    <svg ref={svgRef} className="family-graph"></svg>
  );
}

export default FamilyGraph;