import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm'
import {dragstarted, dragged, dragended} from '../utils/dragFunctions.js'
import settings from './settings.js'
import {
	createSvgArrowHead,
	getLabelContainerPosition,
	getLabelDimensions,
	getLabelRectFill,
	getLabelTextPosition,
	getLinkColour,
	getNodeDimensions
} from './utils/shapeFunctions.js'

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
		.on('click', (e,d)=>console.log('clicked: '+d.type))

	// Initialize the text containers
	const labelContainer = svg.selectAll('svg').data(nodes).enter().append('svg')

	// Add commit label rectangle
	const commitLabel = labelContainer
		.append('rect')
		.attr('width', d => getLabelDimensions(d.type).width)
		.attr('height', d => getLabelDimensions(d.type).height)
		.style('fill', d => getLabelRectFill(d.type))
		.attr('rx', settings.COMMIT_LABEL_WIDTH * 0.1)
		.attr('ry', settings.COMMIT_LABEL_HEIGHT * 0.25)

	// Add commit label texts
	const commitLabelText = labelContainer
		.append('text')
		.attr('class', 'commitLabelText')
		.text(d => {
			if (d.type === 'branch' || d.type === 'head') {
				return d.name.length > settings.BRANCH_LABEL_MAX_LENGTH
					? d.name.slice(0, settings.BRANCH_LABEL_MAX_LENGTH) + '..'
					: d.name
			}
			if (d.type === 'commit' || d.type === 'mergecommit') {
				return d.id.length > settings.COMMIT_LABEL_MAX_LENGTH
					? d.id.slice(0, settings.COMMIT_LABEL_MAX_LENGTH) + '..'
					: d.id
			}
		})
		.attr('x', function (d) {
			return getLabelTextPosition(d, this).x
		})
		.attr('y', function (d) {
			return getLabelTextPosition(d, this).y
		})
		.attr('pointer-events', 'none')
		.attr('fill', d => {
			if (d.type === 'head') return settings.NODE_BORDER_COLOR_HEAD
			else if (d.type === 'commit' || d.type === 'mergecommit') return settings.COMMIT_LABEL_TEXT_COLOR
		})

	// Add commit label copy button
	labelContainer.each(function (d) {
		const data = d
		if (d.type === 'commit' || d.type === 'mergecommit') {
			const image = d3
				.select(this)
				.append('image')
				.attr('class', 'copyIcon')
				.attr('x', settings.COMMIT_LABEL_WIDTH + settings.COMMIT_LABEL_PADDING_X * 2 - settings.COPY_ICON_WIDTH)
				.attr('y', settings.COMMIT_LABEL_HEIGHT / 2 + settings.COMMIT_LABEL_PADDING_Y - settings.COPY_ICON_HEIGHT / 2)
				.attr('width', settings.COPY_ICON_WIDTH)
				.attr('height', settings.COPY_ICON_HEIGHT)
				.attr('xlink:href', 'Assets/copy.png')
				.style('opacity', 0)
				.style('cursor', 'pointer')
				.on('click', () => {
					navigator.clipboard.writeText(data.id)
					image.attr('xlink:href', 'Assets/copy_green.png')
					setTimeout(() => {
						image.attr('xlink:href', 'Assets/copy.png')
					}, 2000)
				})
		}
	})

	labelContainer.on('mouseover', function (d) {
		d3.select(this).select('.copyIcon').style('opacity', 1)
	})
	labelContainer.on('mouseout', function (d) {
		d3.select(this).select('.copyIcon').style('opacity', 0)
	})

	// This function is run at each iteration of the force algorithm, updating the nodes position.
	// note: d is provided by the simulation
	function ticked() {
		link
			.attr('x1', d => d.source.x)
			.attr('y1', d => d.source.y)
			.attr('x2', d => d.target.x)
			.attr('y2', d => d.target.y)

		node.attr('x', d => d.x).attr('y', d => d.y)
		labelContainer.attr('x', d => getLabelContainerPosition(d).x).attr('y', d => getLabelContainerPosition(d).y)
	}
}

export default Graph
