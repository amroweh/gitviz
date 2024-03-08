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
	NODE_RADIUS_COMMIT: 20,
	NODE_WIDTH_BRANCH: 8 * 10,
	NODE_HEIGHT_BRANCH: 30,
	NODE_COLOR_COMMIT: '#FFA500',
	NODE_COLOR_BRANCH: '#68B3A2',
	NODE_COLOR_HEAD: '#FAA0A0',
	NODE_BORDER_COLOR_HEAD: '#8B0000',
	// Label styles
	BRANCH_LABEL_MAX_LENGTH: 6,
	COMMIT_LABEL_MAX_LENGTH: 10,
	// Link styles
	LINK_COLOUR_C_C: '#bf9950',
	LINK_COLOUR_B_C: '#68B3A2',
	LINK_COLOUR_H_CB: '#8B0000'
}
