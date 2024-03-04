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
