import settings from '../settings.js'

export const createNode_Rect = (type, width, height, fill, stroke, strokeWidth) => {
	const rect = document.createElement('rect')
	rect.setAttribute('width', width)
	rect.setAttribute('height', height)
	rect.style.fill = fill
	rect.style.stroke = stroke
	rect.style.strokeWidth = strokeWidth
	rect.classList.add(type)
	return rect
}

export const createNode_Circle = (type, radius, fill, stroke, strokeWidth) => {
	const circle = document.createElement('circle')
	circle.setAttribute('r', radius)
	circle.style.fill = fill
	circle.style.stroke = stroke
	circle.style.strokeWidth = strokeWidth
	circle.classList.add(type)
	return circle
}

export const createSvgArrowHead = (svg, id, refX, fill) => {
	svg
		.append('defs')
		.append('marker')
		.attr('id', id)
		.attr('refX', refX)
		.attr('refY', 3.5)
		.attr('orient', 'auto')
		.attr('markerWidth', 10)
		.attr('markerHeight', 7)
		.append('svg:polygon')
		.attr('points', '0 0, 10 3.5, 0 7')
		.attr('fill', fill)
}

export const getNodeDimensions = type => {
	if (type === 'branch' || type === 'head')
		return {
			width: settings.NODE_WIDTH_BRANCH,
			height: settings.NODE_HEIGHT_BRANCH
		}
	if (type === 'commit' || type === 'mergecommit')
		return {
			width: settings.NODE_DIAMETER_COMMIT,
			height: settings.NODE_DIAMETER_COMMIT
		}
}

export const getTextPosition = type => {
	if (type === 'branch' || type === 'head')
		return {
			x: 0,
			y: 0
		}
	if (type === 'commit' || type === 'mergecommit')
		return {
			x: settings.NODE_DIAMETER_COMMIT,
			y: settings.NODE_DIAMETER_COMMIT
		}
}

export const getLinkColour = (from, to) => {
	if (from === 'commit' && to === 'commit') return settings.LINK_COLOUR_C_C
	if (from === 'head' || to === 'head') return settings.LINK_COLOUR_H_CB
	if (from === 'branch' || to === 'branch') return settings.LINK_COLOUR_B_C
}

export const getLabelDimensions = type => {
	if (type === 'branch' || type === 'head')
		return {
			width: settings.NODE_WIDTH_BRANCH,
			height: settings.NODE_HEIGHT_BRANCH
		}
	if (type === 'commit' || type === 'mergecommit')
		return {
			width: settings.COMMIT_LABEL_WIDTH + 2 * settings.COMMIT_LABEL_PADDING_X,
			height: settings.COMMIT_LABEL_HEIGHT + 2 * settings.COMMIT_LABEL_PADDING_Y
		}
}

export const getLabelContainerPosition = d => {
	if (d.type === 'branch' || d.type === 'head')
		return {
			x: d.x - settings.NODE_WIDTH_BRANCH / 2,
			y: d.y - settings.NODE_HEIGHT_BRANCH / 2 + settings.COMMIT_LABEL_OFFSET_Y
		}
	if (d.type === 'commit' || d.type === 'mergecommit')
		return {
			x: d.x + settings.NODE_DIAMETER_COMMIT / 2 + settings.COMMIT_LABEL_OFFSET_X,
			y: d.y
		}
}

export const getLabelRectFill = type => {
	if (type === 'branch' || type === 'head') return 'none'
	if (type === 'commit' || type === 'mergecommit') return settings.COMMIT_LABEL_COLOR
}

export function getLabelTextPosition(d, context) {
	if (d.type === 'branch' || d.type === 'head') {
		return {
			x: settings.NODE_WIDTH_BRANCH / 2 - context.getBBox().width / 2,
			y: settings.NODE_HEIGHT_BRANCH / 2 + context.getBBox().height / 4
		}
	} else if (d.type === 'commit' || d.type === 'mergecommit') {
		return {
			x: settings.COMMIT_LABEL_WIDTH / 2 + settings.COMMIT_LABEL_PADDING_X - context.getBBox().width / 2,
			y: settings.COMMIT_LABEL_HEIGHT / 2 + settings.COMMIT_LABEL_PADDING_Y + context.getBBox().height / 4
		}
	}
}

export const createCopyIcon = element => {
	const svg = document.createElement('svg')
	svg.setAttribute('x', 0)
	svg.setAttribute('y', 0)
	svg.setAttribute('width', 372)
	svg.setAttribute('height', 458)
	svg.setAttribute('viewbox', '0 0 372 458')
	svg.setAttribute('fill', 'none')
	const rect = document.createElement('rect')
	rect.setAttribute('x', 16)
	rect.setAttribute('y', 72)
	rect.setAttribute('width', 280)
	rect.setAttribute('height', 369.751)
	rect.setAttribute('rx', 56)
	rect.setAttribute('stroke', 'black')
	rect.setAttribute('stroke-width', 32)
	const path = document.createElement('path')
	path.setAttribute('d', 'M119 16H280C321.974 16 356 50.0264 356 92V340')
	path.setAttribute('stroke', 'black')
	path.setAttribute('stroke-width', 32)
	path.setAttribute('stroke-linecap', 'round')
	svg.appendChild(rect)
	svg.appendChild(path)
	return svg
}
