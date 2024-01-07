import Graph from '../graph.js'
import { gitState } from '../gitstate.js'

const convertStateToGraph = () => {
	const nodes = []
	const links = []
	const headId = gitState.HEAD
    console.log(gitState)
	gitState.Objects.Commits.forEach(commit => {
		nodes.push({id: commit.id, name: commit.message, type: 'commit'})
		if (commit.parentCommit !== null && commit.parentCommit !== undefined)
			links.push({source: commit.id, target: commit.parentCommit})
	})
	gitState.Branches.forEach(branch => {
		nodes.push({id: branch.id, name: branch.name, type: 'branch'})
		if (branch.pointsTo !== null && branch.pointsTo !== undefined)
			links.push({source: branch.id, target: branch.pointsTo})
	})
	return {nodes, links, headId}
}
export const updateGraph = () => Graph(convertStateToGraph())
