const getGraphLayout = () => {
	const graphWidth = window.innerWidth
	const graphHeight = window.innerHeight - document.querySelector('#terminal').getBoundingClientRect().height
	return {graphWidth, graphHeight}
}

export default {
	// Graph Styles
	// main layout
	GRAPH_WIDTH: getGraphLayout().graphWidth,
	GRAPH_HEIGHT: getGraphLayout().graphHeight,
    GRAPH_BORDER_SIZE: 10,
	// node styles
	NODE_RADIUS_COMMIT: 10,
	NODE_RADIUS_BRANCH: 20,
	NODE_RADIUS_HEAD: 20
}
