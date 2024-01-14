import Graph from '../graph.js'
import {gitState} from '../gitstate.js'
import {newCommitId} from './idGen.js'
import {updateAreas} from './areaFunctions.js'

const convertStateToGraph = () => {
	const nodes = []
	const links = []
	const headRef = gitState.HEAD
	console.log(gitState)
	// Create Nodes & Links for Commits
	gitState.Objects.Commits.forEach(commit => {
		nodes.push({id: commit.id, name: commit.message, type: 'commit'})
		if (commit.parentCommit !== null && commit.parentCommit !== undefined)
			links.push({source: commit.id, target: commit.parentCommit})
	})
	// Create Nodes & Links for Branches
	gitState.Branches.forEach(branch => {
		const branchGraphId = newCommitId()
		nodes.push({id: branchGraphId, name: branch.name, type: 'branch'})
		if (branch.pointsTo !== null && branch.pointsTo !== undefined)
			links.push({source: branchGraphId, target: branch.pointsTo})
	})
	// Create Nodes & Links for HEAD
	const headId = newCommitId()
	nodes.push({id: headId, name: 'HEAD', type: 'head'})
	links.push({
		source: headId,
		target: Number.isInteger(headRef) ? headRef : nodes.find(branch => branch.name === headRef).id
	})

	console.log({nodes, links, headId: headRef})
	return {nodes, links, headId: headRef}
}
export const updateGraph = () => {
	Graph(convertStateToGraph())
	updateAreas()
}
