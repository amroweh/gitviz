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

export const getNodeDimensions = type => {
	if (type === 'branch' || type === 'head')
		return {
			width: settings.NODE_WIDTH_BRANCH,
			height: settings.NODE_HEIGHT_BRANCH
		}
	if (type === 'commit' || type === 'mergecommit')
		return {
			width: settings.NODE_RADIUS_COMMIT,
			height: settings.NODE_RADIUS_COMMIT
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
			x: settings.NODE_RADIUS_COMMIT,
			y: settings.NODE_RADIUS_COMMIT
		}
}
