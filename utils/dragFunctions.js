export function dragstarted(e, d, simulation) {
	//your alpha hit 0 it stops! make it run again
	simulation.alphaTarget(0.5).restart()
	d.fx = e.x
	d.fy = e.y
}
export function dragged(e, d, simulation) {
	// simulation.alpha(0.005) // PREVIOUS COMMENT: Alpha needs to be set (i.e. not 0) to allow for dragging. Otherwise, nodes won't move
	d.fx = e.x
	d.fy = e.y
}
export function dragended(e, d, simulation) {
	// alpha min is 0, head there
	simulation.alphaTarget(0)
	d.fx = null
	d.fy = null
}
