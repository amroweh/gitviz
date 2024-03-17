const getGraphLayout = () => {
	const graphWidth = window.innerWidth
	const graphHeight = window.innerHeight - document.querySelector('#terminal').getBoundingClientRect().height
	return {graphWidth, graphHeight}
}

export default {
	// main layout
	GRAPH_WIDTH: getGraphLayout().graphWidth,
	GRAPH_HEIGHT: getGraphLayout().graphHeight,
	GRAPH_BORDER_SIZE: 10,
	// node styles
	NODE_DIAMETER_COMMIT: 20,
	NODE_WIDTH_BRANCH: 9 * 10,
	NODE_HEIGHT_BRANCH: 30,
	NODE_COLOR_COMMIT: '#fcc45b',
	NODE_COLOR_BRANCH: '#68B3A2',
	NODE_COLOR_HEAD: '#FAA0A0',
	NODE_BORDER_COLOR_HEAD: '#8B0000',
	NODE_SHADOW_COLOR: 'none',
	// Label styles
	BRANCH_LABEL_MAX_LENGTH: 8,
	COMMIT_LABEL_MAX_LENGTH: 9,
	COMMIT_LABEL_WIDTH: 80,
	COMMIT_LABEL_HEIGHT: 20,
	COMMIT_LABEL_COLOR: '#fcd79288',
	COMMIT_LABEL_TEXT_COLOR: '#7e6b49',
	COMMIT_LABEL_OFFSET_X: 2,
	COMMIT_LABEL_OFFSET_Y: 0,
	COMMIT_LABEL_PADDING_X: 10,
	COMMIT_LABEL_PADDING_Y: 2,
	// Link styles
	LINK_COLOUR_C_C: '#bf9950',
	LINK_COLOUR_B_C: '#68B3A2',
	LINK_COLOUR_H_CB: '#8B0000',
	LINK_SHADOW_COLOR: 'none',
	// Other
	COPY_ICON_WIDTH: 20,
	COPY_ICON_HEIGHT: 16
}
