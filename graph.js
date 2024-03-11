import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm'
import {dragstarted, dragged, dragended} from '../utils/dragFunctions.js'
import settings from './settings.js'
import {createSvgArrowHead, getLinkColour, getNodeDimensions, getTextPosition} from './utils/shapeFunctions.js'

const Graph = ({nodes, links}) => {
	// set the dimensions and margins of the graph
	const margin = {top: 0, right: 0, bottom: 0, left: 0},
		width = settings.GRAPH_WIDTH - margin.left - margin.right,
		height = settings.GRAPH_HEIGHT - margin.top - margin.bottom - settings.GRAPH_BORDER_SIZE

	// append the svg object to the Box component with the dimensions defined above (removes first if already exists)
	if (!d3.select('#graph').select('svg').empty()) {
		d3.select('#graph').select('svg').remove()
	}
	const svg = d3
		.select('#graph')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('id', 'zoomBox')
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
		.force('charge', d3.forceManyBody().strength(-1500)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
		.force('center', d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
		.on('tick', ticked)
		.on('end', ticked)

	// setup arrowheads
	createSvgArrowHead(svg, 'arrowhead_commit', settings.NODE_DIAMETER_COMMIT, settings.LINK_COLOUR_C_C)
	createSvgArrowHead(svg, 'arrowhead_branch', settings.NODE_HEIGHT_BRANCH - 10.5, settings.LINK_COLOUR_B_C)
	createSvgArrowHead(svg, 'arrowhead_head_commit', settings.NODE_DIAMETER_COMMIT, settings.LINK_COLOUR_H_CB)
	createSvgArrowHead(svg, 'arrowhead_head_branch', settings.NODE_HEIGHT_BRANCH - 3.5, settings.LINK_COLOUR_H_CB)

	// Initialize the links
	const link = svg
		.selectAll('line')
		.data(links)
		.enter()
		.append('line')
		.style('stroke', function (d) {
			return getLinkColour(d.source.type, d.target.type)
		})
		.style('stroke-dasharray', d => (d.lineStyle === 'dotted' ? '5,5' : 'none'))
		.style('filter', d => d.withShadow && `drop-shadow(0px 0px 5px ${settings.LINK_SHADOW_COLOR})`)
		.attr('marker-end', d => {
			if (d.source.type === 'commit' || d.source.type === 'mergecommit') return 'url(#arrowhead_commit)'
			if (d.source.type === 'branch') return 'url(#arrowhead_branch)'
			if (d.source.type === 'head' && d.target.type === 'commit') return 'url(#arrowhead_head_commit)'
			if (d.source.type === 'head' && d.target.type === 'branch') return 'url(#arrowhead_head_branch)'
		})

	// Initialize the nodes
	const node = svg
		.selectAll('rect')
		.data(nodes)
		.enter()
		.append('rect')
		.attr('width', d => getNodeDimensions(d.type).width)
		.attr('height', d => getNodeDimensions(d.type).height)
		.style('fill', d => {
			if (d.type === 'commit' || d.type === 'mergecommit') return settings.NODE_COLOR_COMMIT
			else if (d.type === 'branch') return settings.NODE_COLOR_BRANCH
			else if (d.type === 'head') return settings.NODE_COLOR_HEAD
		})
		.style('stroke', d => {
			if (d.type === 'mergecommit') return '#c36b00'
			if (d.type === 'head') return settings.NODE_BORDER_COLOR_HEAD
		})
		.style('stroke-width', '3px')
		.style('rx', d => (d.type === 'commit' || d.type === 'mergecommit') && 50)
		.style('ry', d => (d.type === 'commit' || d.type === 'mergecommit') && 30)
		.style('filter', d => d.withShadow && `drop-shadow(0px 0px 5px ${settings.NODE_SHADOW_COLOR})`)
		.attr('transform', d => {
			if (d.type === 'commit' || d.type === 'mergecommit')
				return 'translate(-' + settings.NODE_DIAMETER_COMMIT / 2 + ' -' + settings.NODE_DIAMETER_COMMIT / 2 + ')'
			else if (d.type === 'branch' || d.type === 'head')
				return 'translate(-' + settings.NODE_WIDTH_BRANCH / 2 + ' -' + settings.NODE_HEIGHT_BRANCH / 2 + ')'
		})
		.attr('rx', settings.NODE_WIDTH_BRANCH * 0.1)
		.attr('ry', settings.NODE_HEIGHT_BRANCH * 0.25)
		.call(
			d3
				.drag()
				.on('start', (e, d) => dragstarted(e, d, simulation))
				.on('drag', (e, d) => dragged(e, d, simulation))
				.on('end', (e, d) => dragended(e, d, simulation))
		)

	// Initialize the text containers
	const labelContainer = svg.selectAll('text').data(nodes).enter().append('g')

	// Add commit label rectangle
	const commitLabel = labelContainer
		.append('rect')
		.attr('width', settings.COMMIT_LABEL_WIDTH + 2 * settings.COMMIT_LABEL_PADDING_X)
		.attr('height', settings.COMMIT_LABEL_HEIGHT + 2 * settings.COMMIT_LABEL_PADDING_Y)
		.style('fill', settings.COMMIT_LABEL_COLOR)
		.style('display', d => !(d.type === 'commit' || d.type === 'mergecommit') && 'none')
		.attr('rx', settings.COMMIT_LABEL_WIDTH * 0.1)
		.attr('ry', settings.COMMIT_LABEL_HEIGHT * 0.25)

	// Add commit label texts
	const nodeNameText = labelContainer
		.append('text')
		.attr('class', 'nodeNameText')
		.text(d => {
			if (d.name.length > settings.BRANCH_LABEL_MAX_LENGTH) {
				if (d.type === 'branch' || d.type === 'head') return d.name.slice(0, settings.BRANCH_LABEL_MAX_LENGTH) + '..'
				if (d.type === 'commit' || d.type === 'head') return d.id.toString().slice(0, settings.COMMIT_LABEL_MAX_LENGTH) + '..'
			}
			return d.name
		})
		.attr('pointer-events', 'none')
		.attr('fill', d => d.type === 'head' && settings.NODE_BORDER_COLOR_HEAD)

	// This function is run at each iteration of the force algorithm, updating the nodes position.
	// note: d is provided by the simulation
	function ticked() {
		link
			.attr('x1', d => d.source.x)
			.attr('y1', d => d.source.y)
			.attr('x2', d => d.target.x)
			.attr('y2', d => d.target.y)

		node.attr('x', d => d.x).attr('y', d => d.y)
		commitLabel
			.attr('x', d => d.x + settings.NODE_DIAMETER_COMMIT / 2 + settings.COMMIT_LABEL_OFFSET_X)
			.attr('y', d => d.y + settings.COMMIT_LABEL_OFFSET_Y)
		nodeNameText
			.attr('x', function (d) {
				if (d.type === 'commit' || d.type === 'mergecommit')
					return (
						d.x + settings.NODE_DIAMETER_COMMIT / 2 + settings.COMMIT_LABEL_OFFSET_X + settings.COMMIT_LABEL_PADDING_X
					)
				else if (d.type === 'branch' || d.type === 'head') return d.x - this.getBBox().width / 2
			})
			.attr('y', function (d) {
				if (d.type === 'commit' || d.type === 'mergecommit')
					return d.y + this.getBBox().height / 4 + settings.COMMIT_LABEL_HEIGHT / 2 + settings.COMMIT_LABEL_PADDING_Y
				else if (d.type === 'branch' || d.type === 'head') return d.y + this.getBBox().height / 4
			})
	}
}

export default Graph
