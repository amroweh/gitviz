import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm'

export let zoom = d3.zoom().on('zoom', handleZoom)

function handleZoom(e) {
	d3.select('svg g#zoomBox').attr('transform', e.transform)
}
d3.select('svg').call(zoom)

// Zoom Functions
function d3Zoom(scale) {
	d3.select('svg').transition().call(zoom.scaleBy, scale)
}

function resetD3Zoom() {
	d3.select('svg').transition().call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1))
}

function d3ZoomTo(level) {
	d3.select('svg').transition().call(zoom.scaleTo, level)
}

function getZoomScale() {
	return d3.zoomTransform(d3.select('svg').node()).k
}

// Zoom Controls
window.onload = () => {
	const zoomInToggle = document.getElementById('zoom_in_btn')
	const zoomOutToggle = document.getElementById('zoom_out_btn')
	const resetZoomToggle = document.getElementById('zoom_reset_btn')
	const earthViewToggle = document.getElementById('zoom_far_btn')

	// Zoom event listeners and events
	zoomInToggle.onclick = () => d3Zoom(2)
	zoomOutToggle.onclick = () => d3Zoom(0.5)
	resetZoomToggle.onclick = resetD3Zoom
	earthViewToggle.onclick = () => {
		getZoomScale() !== 0.2 ? d3ZoomTo(0.2) : resetD3Zoom()
	}
}
