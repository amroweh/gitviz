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
