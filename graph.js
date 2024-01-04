import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm'
import {dragstarted, dragged, dragended} from '../utils/dragFunctions.js'

const Graph = ({nodes, links, headId}) => {
	// set the dimensions and margins of the graph
	const margin = {top: 0, right: 0, bottom: 0, left: 0},
		width = 1000 - margin.left - margin.right,
		height = 800 - margin.top - margin.bottom,
		radius = 20,
		textOffsetX = 1.2 * radius,
		textOffsetY = 0,
		labelTextOffsetX = -radius - 50,
		labelTextOffsetY = -radius,
		labelRectOffsetX = labelTextOffsetX - 5.5,
		labelRectOffsetY = labelTextOffsetY - 17

	// append the svg object to the Box component with the dimensions defined above (removes if already there)
	if (!d3.select('#graph').select('svg').empty()) {
		d3.select('#graph').select('svg').remove()
	}
	const svg = d3
		.select('#graph')
		.append('svg')
		.style('border', '1px solid blue') // TO BE REMOVED LATER
		.style('background-color', 'white') // TO BE REMOVED LATER
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

	// Let's list the force we wanna apply on the network
	const simulation = d3
		.forceSimulation(nodes) // Force algorithm is applied to data.nodes
		.force(
			'link',
			d3
				.forceLink() // This force provides links between nodes
				.id(d => d.id) // This provide  the id of a node
				.links(links) // and this the list of links
		)
		.force('charge', d3.forceManyBody().strength(-2500)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
		.force('center', d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
		.on('tick', ticked)
		.on('end', ticked)

	// setup arrowhead marker for links between 2 branches
	svg
		.append('defs')
		.append('marker')
		.attr('id', 'arrowhead_branch_branch')
		.attr('refX', radius + 10) // Add marker width to radius
		.attr('refY', 3.5)
		.attr('orient', 'auto')
		.attr('markerWidth', 10)
		.attr('markerHeight', 7)
		.append('svg:polygon')
		.attr('points', '0 0, 10 3.5, 0 7')
		.attr('fill', 'black')

	// setup arrowhead marker for links between branch and commit
	svg
		.append('defs')
		.append('marker')
		.attr('id', 'arrowhead_branch_commit')
		.attr('refX', radius / 2 + 10) // Add marker width to radius
		.attr('refY', 3.5)
		.attr('orient', 'auto')
		.attr('markerWidth', 10)
		.attr('markerHeight', 7)
		.append('svg:polygon')
		.attr('points', '0 0, 10 3.5, 0 7')
		.attr('fill', 'black')

	// Initialize the links
	const link = svg
		.selectAll('line')
		.data(links)
		.enter()
		.append('line')
		.style('stroke', '#aaa')
		.attr('marker-end', d =>
			d.target.type === 'branch' ? 'url(#arrowhead_branch_branch)' : 'url(#arrowhead_branch_commit)'
		)

	// Initialize the nodes
	const node = svg
		.selectAll('circle')
		.data(nodes)
		.enter()
		.append('circle')
		.attr('r', d => (d.type === 'branch' ? radius : radius / 2))
		.style('fill', d => (d.type === 'branch' ? '#69b3a2' : 'orange'))
		.style('stroke-width', '4px')
		.style('stroke', d => {
			if (d.id === headId) return 'purple'
		})
		.call(
			d3
				.drag()
				.on('start', (e, d) => dragstarted(e, d, simulation))
				.on('drag', (e, d) => dragged(e, d, simulation))
				.on('end', (e, d) => dragended(e, d, simulation))
		)

	// Initialize the text containers
	const branchContainer = svg.selectAll('text').data(nodes).enter().append('g')

	// Add branch name texts
	const branchNameText = branchContainer
		.append('text')
		.attr('class', 'branchNameText')
		.text(d => d.name) // adds asterisk to head branch

	// Add the labels
	const labelBox = branchContainer
		.append('rect')
		.attr('width', d => (d.id === headId ? 55 : 0))
		.attr('height', d => (d.id === headId ? 25 : 0))
		.style('fill', 'purple')
		.style('rx', 3)
		.style('ry', 3)

	const labelText = branchContainer
		.append('text')
		.text(d => (d.id === headId ? 'HEAD' : null))
		.style('fill', d => (d.id === headId ? '#CF9FFF' : null))
		.attr('class', 'labelText')

	// This function is run at each iteration of the force algorithm, updating the nodes position.
	// note: d is provided by the simulation
	function ticked() {
		link
			.attr('x1', d => d.source.x)
			.attr('y1', d => d.source.y)
			.attr('x2', d => d.target.x)
			.attr('y2', d => d.target.y)

		node.attr('cx', d => d.x).attr('cy', d => d.y)
		branchNameText.attr('x', d => d.x + textOffsetX).attr('y', d => d.y + textOffsetY)
		labelText.attr('x', d => d.x + labelTextOffsetX).attr('y', d => d.y + labelTextOffsetY)
		labelBox.attr('x', d => d.x + labelRectOffsetX).attr('y', d => d.y + labelRectOffsetY)
	}
}

export default Graph
